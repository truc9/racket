package handler

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type RegistrationHandler struct {
	db     *gorm.DB
	logger *zap.SugaredLogger
}

func NewRegHandler(db *gorm.DB, logger *zap.SugaredLogger) *RegistrationHandler {
	return &RegistrationHandler{
		db:     db,
		logger: logger,
	}
}

func (h *RegistrationHandler) AttendantRequest(c *gin.Context) {
	dto := dto.AttendantRequestDto{}
	var err error
	if err = c.BindJSON(&dto); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	debugf := h.logger.Debugf

	err = h.db.Transaction(func(tx *gorm.DB) error {
		var player *domain.Player
		err := h.db.Where("external_user_id = ?", dto.ExternalUserId).First(&player).Error

		debugf("getting player done %v with error %v", player, err)

		// create player if it not exist
		if errors.Is(err, gorm.ErrRecordNotFound) {
			player = &domain.Player{
				FirstName:      dto.FirstName,
				LastName:       dto.LastName,
				Email:          dto.Email,
				ExternalUserId: dto.ExternalUserId,
			}

			if err := tx.Create(player).Error; err != nil {
				return err
			}

			debugf("create player done %v with error %v", player, err)
		}

		// find existing registration for this player & this match
		var reg *domain.Registration
		err = h.db.Model(&domain.Registration{}).
			Where("player_id = ? AND match_id = ?", player.ID, dto.MatchId).
			Scan(&reg).
			Error

		debugf("getting registration done %v with error %v", reg, err)

		if err != nil {
			return err
		}

		// create registration if not found
		if reg == nil {
			reg = &domain.Registration{
				MatchId:  dto.MatchId,
				PlayerId: player.ID,
			}

			err = tx.Create(reg).Error

			debugf("create registration done %v with error %v", reg, err)

			return err
		}

		// delete if already registed
		err = tx.Unscoped().Delete(reg).Error

		debugf("delete registration done %v with error %v", reg, err)

		return err
	})

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.Status(http.StatusOK)
}

func (h *RegistrationHandler) Register(c *gin.Context) {
	dto := dto.RegistrationDto{}
	var err error
	if err = c.BindJSON(&dto); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	var count int64
	h.db.Model(&domain.Registration{}).
		Where("player_id = ? AND match_id = ?", dto.PlayerId, dto.MatchId).
		Count(&count)

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Player already registered this match"})
	} else {
		p := &domain.Registration{
			PlayerId: dto.PlayerId,
			MatchId:  dto.MatchId,
			IsPaid:   false,
		}
		h.db.Create(p)
		c.JSON(http.StatusCreated, p)
	}
}

func (h *RegistrationHandler) Unregister(c *gin.Context) {
	id, _ := c.Params.Get("registrationId")
	h.db.Unscoped().Delete(&domain.Registration{}, id)
	c.JSON(http.StatusOK, id)
}

func (h *RegistrationHandler) MarkPaid(c *gin.Context) {
	registrationId, _ := c.Params.Get("registrationId")
	entity := domain.Registration{}
	h.db.Find(&entity, registrationId)

	entity.MarkPaid()
	h.db.Save(&entity)
	c.JSON(http.StatusOK, entity)
}

func (h *RegistrationHandler) MarkUnPaid(c *gin.Context) {
	registrationId, _ := c.Params.Get("registrationId")
	entity := domain.Registration{}
	h.db.Find(&entity, registrationId)

	entity.MarkUnpaid()
	h.db.Save(&entity)
	c.JSON(http.StatusOK, entity)
}

func (h *RegistrationHandler) GetAll(c *gin.Context) {
	var result []dto.RegistrationOverviewDto
	h.logger.Info("querying registration report")
	h.db.Raw(`
		SELECT	
			r.id AS registration_id,
			m.id AS match_id, 
			p.id AS player_id,
			COALESCE(sc.name,'N/A') AS location,
			m.start, 
			m.end, 
			CONCAT(p.first_name, ' ', p.last_name) as player_name,
			r.is_paid
		FROM "matches" m 
		LEFT JOIN "registrations" r ON m.id = r.match_id
		LEFT JOIN "players" p ON p.id = r.player_id AND p.deleted_at IS NULL
		LEFT JOIN "sport_centers" sc ON sc.id = m.sport_center_id
		WHERE r.deleted_at IS NULL
		ORDER BY p.first_name ASC
	`).Scan(&result)

	log.Print(result)

	c.JSON(http.StatusOK, result)
}
