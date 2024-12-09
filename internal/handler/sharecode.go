package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/internal/domain"
	"github.com/truc9/racket/internal/dto"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type ShareCodeHandler struct {
	db     *gorm.DB
	logger *zap.SugaredLogger
}

func NewShareCodeHandler(db *gorm.DB, logger *zap.SugaredLogger) *ShareCodeHandler {
	return &ShareCodeHandler{
		db:     db,
		logger: logger,
	}
}

func (h *ShareCodeHandler) CreateShareUrl(c *gin.Context) {
	dto := dto.CreateShareUrlDto{}
	var err error
	if err = c.BindJSON(&dto); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	sc := domain.NewShareCodeWithUrl(dto.Url, &domain.DefaultGenerator{})

	if err := h.db.Create(sc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, sc)
}
