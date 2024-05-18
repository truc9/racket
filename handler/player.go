package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/handler/dto"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type playerHandler struct {
	db    *gorm.DB
	sugar *zap.SugaredLogger
}

func NewPlayerHandler(db *gorm.DB, sugar *zap.SugaredLogger) *playerHandler {
	return &playerHandler{
		db:    db,
		sugar: sugar,
	}
}

func (h playerHandler) Create(ctx *gin.Context) {
	dto := dto.PlayerDto{}
	var err error
	if err = ctx.BindJSON(&dto); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	p := &domain.Player{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
	}
	h.db.Create(p)
	ctx.JSON(http.StatusCreated, p)
}

func (h playerHandler) GetAll(ctx *gin.Context) {
	var result []domain.Player
	h.db.Order("first_name ASC").Find(&result)
	ctx.JSON(http.StatusOK, result)
}
