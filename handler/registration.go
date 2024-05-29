package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type RegistrationHandler struct {
	db     *gorm.DB
	logger *zap.SugaredLogger
}

func NewRegHandler(db *gorm.DB, logger *zap.SugaredLogger) *RegistrationHandler {
	return &RegistrationHandler{
		db:     db,
		logger: logger,
	}
}

func (h RegistrationHandler) Register(ctx *gin.Context) {
	dto := dto.RegistrationDto{}
	var err error
	if err = ctx.BindJSON(&dto); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	var count int64
	h.db.Model(&domain.Registration{}).
		Where("player_id = ? AND match_id = ?", dto.PlayerId, dto.MatchId).
		Count(&count)

	if count > 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Player already registered this match"})
	} else {
		p := &domain.Registration{
			PlayerId: dto.PlayerId,
			MatchId:  dto.MatchId,
			IsPaid:   false,
		}
		h.db.Create(p)
		ctx.JSON(http.StatusCreated, p)
	}
}

func (h RegistrationHandler) Unregister(ctx *gin.Context) {
	id, _ := ctx.Params.Get("registrationId")
	h.db.Unscoped().Delete(&domain.Registration{}, id)
	ctx.JSON(http.StatusOK, id)
}

func (h RegistrationHandler) MarkPaid(ctx *gin.Context) {
	registrationId, _ := ctx.Params.Get("registrationId")
	entity := domain.Registration{}
	h.db.Find(&entity, registrationId)

	entity.MarkPaid()
	h.db.Save(&entity)
	ctx.JSON(http.StatusOK, entity)
}

func (h RegistrationHandler) MarkUnPaid(ctx *gin.Context) {
	registrationId, _ := ctx.Params.Get("registrationId")
	entity := domain.Registration{}
	h.db.Find(&entity, registrationId)

	entity.MarkUnpaid()
	h.db.Save(&entity)
	ctx.JSON(http.StatusOK, entity)
}

func (h RegistrationHandler) GetAll(ctx *gin.Context) {
	var result []dto.RegistrationOverviewDto
	h.logger.Info("querying registration report")
	h.db.Raw(`
		SELECT	
			r.id as registration_id,
			m.id as match_id, 
			p.id as player_id,
			m.location, 
			m.start, 
			m.end, 
			CONCAT(p.first_name, ' ', p.last_name) as player_name,
			r.is_paid
		FROM "matches" m 
		LEFT JOIN "registrations" r ON m.id = r.match_id
		LEFT JOIN "players" p ON p.id = r.player_id AND p.deleted_at IS NULL
		WHERE r.deleted_at IS NULL
	`).Scan(&result)

	log.Print(result)

	ctx.JSON(http.StatusOK, result)
}
