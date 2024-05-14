package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"gorm.io/gorm"
)

type Reg struct {
	Db *gorm.DB
}

func (h Reg) Create(ctx *gin.Context) {
	dto := dto.RegistrationDto{}
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		p := &domain.Registration{
			PlayerId: dto.PlayerId,
			MatchId:  dto.MatchId,
			IsPaid:   false,
		}
		h.Db.Create(p)
		ctx.JSON(http.StatusCreated, p)
	}
	ctx.JSON(http.StatusBadRequest, nil)
}

func (h Reg) GetAll(ctx *gin.Context) {

}
