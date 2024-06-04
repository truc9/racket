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

func (h PlayerHandler) GetExternalUserAttendantRequests(c *gin.Context) {
	var result []dto.PlayerAttendantRequestDto
	externalUserId := params.Get(c, "externalUserId")
	h.db.Raw(`
	SELECT
		m.id AS match_id,
		pl.id AS player_id,
		m.start,
		m.end,
		sc.name AS sport_center_name,
		sc.location AS sport_center_location,
		re.id IS NOT NULL AS is_requested
	FROM "matches" m
	JOIN "sport_centers" sc ON m.sport_center_id = sc.id AND sc.deleted_at IS NULL
	LEFT JOIN "registrations" re ON m.id = re.match_id AND re.deleted_at IS NULL
	LEFT JOIN "players" pl ON pl.id = re.player_id AND pl.deleted_at IS NULL
	WHERE m.deleted_at IS NULL
	AND (pl.external_user_id IS NULL OR pl.external_user_id = ?)
	ORDER BY m.start DESC
	`, externalUserId).Scan(&result)

	h.logger.Info(result)

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
	h.db.Unscoped().Delete(&domain.Player{}, id)
	c.Status(http.StatusOK)
}
