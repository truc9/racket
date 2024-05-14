package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"gorm.io/gorm"
)

type Match struct {
	Db *gorm.DB
}

func (h Match) GetAll(ctx *gin.Context) {
	var result []domain.Match
	h.Db.Find(&result)
	ctx.JSON(http.StatusOK, result)
}

func (h Match) Create(ctx *gin.Context) {
	dto := dto.MatchDto{}
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		m := &domain.Match{
			Start:    dto.Start,
			End:      dto.End,
			Location: dto.Location,
		}
		h.Db.Create(m)
		ctx.JSON(http.StatusCreated, m)
	}
	ctx.JSON(http.StatusBadRequest, nil)
}
