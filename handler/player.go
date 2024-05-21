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

func (h playerHandler) Create(c *gin.Context) {
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

func (h playerHandler) GetAll(c *gin.Context) {
	var p []domain.Player
	h.db.Order("first_name ASC").Find(&p)
	c.JSON(http.StatusOK, p)
}

func (h playerHandler) Update(c *gin.Context) {
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

func (h playerHandler) Delete(c *gin.Context) {
	id := params.Get(c, "playerId")
	h.db.Delete(&domain.Player{}, id)
	c.Status(http.StatusOK)
}
