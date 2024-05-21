package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/handler/dto"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type matchHandler struct {
	db    *gorm.DB
	sugar *zap.SugaredLogger
}

func NewMatchHandler(db *gorm.DB, sugar *zap.SugaredLogger) *matchHandler {
	return &matchHandler{
		db:    db,
		sugar: sugar,
	}
}

func (h matchHandler) GetAll(ctx *gin.Context) {
	var result []domain.Match
	h.db.Order("start DESC").Find(&result)
	ctx.JSON(http.StatusOK, result)
}

func (h matchHandler) Create(ctx *gin.Context) {
	dto := dto.MatchDto{}
	var err error
	if err = ctx.BindJSON(&dto); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	h.sugar.Debug(dto)

	m := &domain.Match{
		Start:    dto.Start,
		End:      dto.End,
		Location: dto.Location,
	}

	h.sugar.Debug(m)

	if err = h.db.Create(m).Error; err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	ctx.JSON(http.StatusCreated, m)
}

func (h matchHandler) GetRegistrationsByMatch(ctx *gin.Context) {
	var result []dto.RegistrationOverviewDto
	matchId, _ := ctx.Params.Get("matchId")
	h.sugar.Infof("getting match id %s", matchId)
	h.db.Raw(`
		SELECT pl.id AS player_id, CONCAT(pl.first_name, ' ', pl.last_name) AS player_name, re.id AS registration_id, re.match_id, re.is_paid
		FROM "players" pl
		LEFT JOIN "registrations" re ON pl.id = re.player_id AND re.deleted_at IS NULL AND re.match_id = ?
		WHERE pl.deleted_at IS NULL
		ORDER BY pl.first_name ASC		
	`, matchId).Scan(&result)

	h.sugar.Info(result)

	ctx.JSON(http.StatusOK, result)
}
