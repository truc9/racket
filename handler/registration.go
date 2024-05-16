package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/handler/dto"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type registrationHandler struct {
	db    *gorm.DB
	sugar *zap.SugaredLogger
}

func NewRegHandler(db *gorm.DB, sugar *zap.SugaredLogger) *registrationHandler {
	return &registrationHandler{
		db:    db,
		sugar: sugar,
	}
}

func (h registrationHandler) Register(ctx *gin.Context) {
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

func (h registrationHandler) Unregister(ctx *gin.Context) {
	id, _ := ctx.Params.Get("id")
	h.db.Model(&domain.Registration{}).Delete(id)
	ctx.JSON(http.StatusOK, id)
}

func (h registrationHandler) GetAll(ctx *gin.Context) {
	var result []dto.RegistrationOverviewDto
	h.sugar.Info("querying registration report")
	h.db.Raw(`
	select 
		m.id as matchId, 
		m.location, 
		m.start, 
		m.end, 
		p.id as playerId, 
		CONCAT(p.first_name, p.last_name) as playerName,
		r.is_paid as isPaid
	from "matches" m 
	left join "registrations" r on m.id = r.match_id
	left join "players" p on p.id = r.player_id
	`).Scan(&result)

	log.Print(result)

	ctx.JSON(http.StatusOK, result)
}
