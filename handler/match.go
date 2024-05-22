package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/handler/dto"
	"github.com/truc9/racket/params"
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

func (h matchHandler) GetAll(c *gin.Context) {
	var result []domain.Match
	h.db.Order("start DESC").Find(&result)
	c.JSON(http.StatusOK, result)
}

func (h matchHandler) Create(c *gin.Context) {
	dto := dto.MatchDto{}
	var err error
	if err = c.BindJSON(&dto); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
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
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusCreated, m)
}

func (h matchHandler) GetRegistrationsByMatch(c *gin.Context) {
	var result []dto.RegistrationOverviewDto
	matchId, _ := c.Params.Get("matchId")
	h.sugar.Infof("getting match id %s", matchId)
	h.db.Raw(`
		SELECT pl.id AS player_id, CONCAT(pl.first_name, ' ', pl.last_name) AS player_name, re.id AS registration_id, re.match_id, re.is_paid
		FROM "players" pl
		LEFT JOIN "registrations" re ON pl.id = re.player_id AND re.deleted_at IS NULL AND re.match_id = ?
		WHERE pl.deleted_at IS NULL
		ORDER BY pl.first_name ASC		
	`, matchId).Scan(&result)

	h.sugar.Info(result)

	c.JSON(http.StatusOK, result)
}

func (h matchHandler) UpdateCost(c *gin.Context) {
	matchId := params.Get(c, "matchId")
	dto := dto.MatchCostDto{}
	if err := c.BindJSON(&dto); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	match := domain.Match{}
	if err := h.db.Find(&match, matchId).Error; err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	match.UpdateCost(dto.Cost)
	h.db.Save(&match)
	c.JSON(http.StatusOK, match)
}
