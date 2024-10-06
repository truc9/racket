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

func (h *PlayerHandler) Create(c *gin.Context) {
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

func (h *PlayerHandler) GetAll(c *gin.Context) {
	var result []domain.Player
	h.db.Order("first_name ASC").Find(&result)
	c.JSON(http.StatusOK, result)
}

func (h *PlayerHandler) GetExternalUserAttendantRequests(c *gin.Context) {
	var result []dto.PlayerAttendantRequestDto
	externalUserId := params.Get(c, "externalUserId")
	h.db.Raw(`
	SELECT m.id as match_id, pl.id as player_id
	FROM matches m
	JOIN registrations re ON m.id = re.match_id
	JOIN players pl ON pl.id = re.player_id
	WHERE pl.external_user_id = ?
	`, externalUserId).Scan(&result)

	h.logger.Info(result)

	c.JSON(http.StatusOK, result)
}

func (h *PlayerHandler) Update(c *gin.Context) {
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

func (h *PlayerHandler) Delete(c *gin.Context) {
	id := params.Get(c, "playerId")

	if err := h.db.Unscoped().Where("player_id = ?", id).Delete(&domain.Registration{}).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
		return
	}

	if err := h.db.Unscoped().Delete(&domain.Player{}, id).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.Status(http.StatusOK)
}

func (h *PlayerHandler) SendWelcomeEmail(c *gin.Context) {
	dto := &dto.EmailDto{}
	c.BindJSON(dto)

	playerId := params.Get(c, "playerId")
	var name string
	h.db.Find(&domain.Player{}, playerId).Select("first_name", &name)
	c.Status(http.StatusOK)
}
