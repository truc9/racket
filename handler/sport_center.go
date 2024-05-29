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

type SportCenterHandler struct {
	db     *gorm.DB
	logger *zap.SugaredLogger
}

func NewSportCenterHandler(db *gorm.DB, logger *zap.SugaredLogger) *SportCenterHandler {
	return &SportCenterHandler{
		db:     db,
		logger: logger,
	}
}

func (h *SportCenterHandler) GetAll(c *gin.Context) {
	var result []dto.SportCenterDto
	if err := h.db.Find(&result); err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *SportCenterHandler) Create(c *gin.Context) {
	dto := dto.SportCenterDto{}
	if err := c.BindJSON(&dto); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	h.db.Create(&domain.SportCenter{
		Name:     dto.Name,
		Location: dto.Location,
	})

	c.Status(http.StatusOK)
}

func (h *SportCenterHandler) Update(c *gin.Context) {
	dto := dto.SportCenterDto{}
	id := params.Get(c, "sportCenterId")

	if err := c.BindJSON(&dto); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	entity := domain.SportCenter{}
	if err := h.db.Find(&entity, id).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	entity.Name = dto.Name
	entity.Location = dto.Location

	h.db.Save(entity)
	c.Status(http.StatusOK)
}
