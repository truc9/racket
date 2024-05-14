package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"gorm.io/gorm"
)

type Player struct {
	Db *gorm.DB
}

func (h Player) Create(ctx *gin.Context) {
	dto := dto.PlayerDto{}
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		p := &domain.Player{
			FirstName: dto.FirstName,
			LastName:  dto.LastName,
		}
		h.Db.Create(p)
		ctx.JSON(http.StatusCreated, p)
	}
	ctx.JSON(http.StatusBadRequest, nil)
}
