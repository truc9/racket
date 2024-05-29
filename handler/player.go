package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"github.com/truc9/racket/params"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type PlayerHandler struct {
	db     *gorm.DB
	logger *zap.SugaredLogger
}

func NewPlayerHandler(db *gorm.DB, logger *zap.SugaredLogger) *PlayerHandler {
	return &PlayerHandler{
		db:     db,
		logger: logger,
	}
}

func (h PlayerHandler) Create(c *gin.Context) {
	dto := dto.PlayerDto{}
	var err error
	if err = c.BindJSON(&dto); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	p := &domain.Player{
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
	}
	h.db.Create(p)
	c.JSON(http.StatusCreated, p)
}

func (h PlayerHandler) GetAll(c *gin.Context) {
	var result []domain.Player
	h.db.Order("first_name ASC").Find(&result)
	c.JSON(http.StatusOK, result)
}

func (h PlayerHandler) Update(c *gin.Context) {
	var model dto.PlayerDto
	id := params.Get(c, "playerId")
	if err := c.BindJSON(&model); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	p := domain.Player{}
	h.db.Find(&p, id)

	p.FirstName = model.FirstName
	p.LastName = model.LastName
	h.db.Save(&p)
	c.JSON(http.StatusOK, p)
}

func (h PlayerHandler) Delete(c *gin.Context) {
	id := params.Get(c, "playerId")
	h.db.Delete(&domain.Player{}, id)
	c.Status(http.StatusOK)
}
