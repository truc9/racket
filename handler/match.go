package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/samber/lo"
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"github.com/truc9/racket/params"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type MatchHandler struct {
	db     *gorm.DB
	logger *zap.SugaredLogger
}

func NewMatchHandler(db *gorm.DB, logger *zap.SugaredLogger) *MatchHandler {
	return &MatchHandler{
		db:     db,
		logger: logger,
	}
}

func (h *MatchHandler) GetAll(c *gin.Context) {
	var matches []domain.Match
	h.db.Preload("SportCenter").Order("start DESC").Find(&matches)

	result := lo.Map(matches, func(m domain.Match, _ int) dto.MatchDto {
		return dto.MatchDto{
			MatchId:         m.ID,
			Start:           m.Start,
			End:             m.End,
			SportCenterId:   m.SportCenterId,
			SportCenterName: m.SportCenter.Name,
		}
	})

	c.JSON(http.StatusOK, result)
}

func (h *MatchHandler) Create(c *gin.Context) {
	dto := dto.MatchDto{}
	var err error
	if err = c.BindJSON(&dto); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	h.logger.Debug(dto)

	m := &domain.Match{
		Start:         dto.Start,
		End:           dto.End,
		SportCenterId: dto.SportCenterId,
	}

	h.logger.Debug(m)

	if err = h.db.Create(m).Error; err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusCreated, m)
}

func (h *MatchHandler) GetRegistrationsByMatch(c *gin.Context) {
	var result []dto.RegistrationOverviewDto
	matchId, _ := c.Params.Get("matchId")
	h.logger.Infof("getting match id %s", matchId)
	h.db.Raw(`
		SELECT pl.id AS player_id, CONCAT(pl.first_name, ' ', pl.last_name) AS player_name, re.id AS registration_id, re.match_id, re.is_paid
		FROM "players" pl
		LEFT JOIN "registrations" re ON pl.id = re.player_id AND re.deleted_at IS NULL AND re.match_id = ?
		WHERE pl.deleted_at IS NULL
		ORDER BY pl.first_name ASC	
	`, matchId).Scan(&result)

	h.logger.Info(result)

	c.JSON(http.StatusOK, result)
}

func (h *MatchHandler) UpdateCost(c *gin.Context) {
	matchId := params.Get(c, "matchId")
	dto := dto.MatchCostDto{}
	if err := c.BindJSON(&dto); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	match := domain.Match{}
	if err := h.db.Find(&match, matchId).Error; err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	match.UpdateCost(dto.Cost)
	h.db.Save(&match)
	c.JSON(http.StatusOK, match)
}

func (h *MatchHandler) GetCost(c *gin.Context) {
	matchId := params.Get(c, "matchId")
	var cost float64
	if err := h.db.Select("cost").Find(&domain.Match{}, matchId).Scan(&cost).Error; err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, cost)
}

func (h *MatchHandler) GetAdditionalCost(c *gin.Context) {
	matchId := params.Get(c, "matchId")
	var costs []float64
	if err := h.db.Model(&domain.AdditionalCost{}).Where("match_id = ?", matchId).Select("cost").Scan(&costs).Error; err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	additionalCost := lo.Sum(costs)

	c.JSON(http.StatusOK, additionalCost)
}

func (h *MatchHandler) CreateAdditionalCost(c *gin.Context) {
	matchId := params.Get(c, "matchId")
	dto := dto.AdditionalCostDto{}
	if err := c.BindJSON(&dto); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	match := domain.Match{}
	if err := h.db.Find(&match, matchId).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": "match not found",
		})
		return
	}

	match.AddCost(dto.Description, dto.Amount)
	h.db.Save(&match)
	c.JSON(http.StatusOK, match)
}
