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
	h.db.Find(&result)
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
