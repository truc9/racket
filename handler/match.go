package handler

import (
	"net/http"
	"strconv"

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
	h.db.
		Preload("SportCenter").
		Preload("AdditionalCosts").
		Order("start DESC").
		Find(&matches)

	result := lo.Map(matches, func(m domain.Match, _ int) dto.MatchDto {
		return dto.MatchDto{
			MatchId:          m.ID,
			Start:            m.Start,
			End:              m.End,
			SportCenterId:    m.SportCenterId,
			SportCenterName:  m.SportCenter.Name,
			CostPerSection:   m.SportCenter.CostPerSection,
			MinutePerSection: m.SportCenter.MinutePerSection,
			Cost:             m.Cost,
			AdditionalCost: lo.SumBy(m.AdditionalCosts, func(ac domain.AdditionalCost) float64 {
				return ac.Amount
			}),
			Court:         m.Court,
			CustomSection: m.CustomSection,
		}
	})

	c.JSON(http.StatusOK, result)
}

func (h *MatchHandler) GetUpcomingMatches(c *gin.Context) {
	var matches []domain.Match
	h.db.
		Preload("SportCenter").
		Preload("AdditionalCosts").
		Preload("Registrations").
		Where("start >= CURRENT_DATE").Order("start ASC").
		Find(&matches)

	h.logger.Debugf("Query matches: %v", matches)

	result := lo.Map(matches, func(m domain.Match, _ int) dto.MatchDto {
		return dto.MatchDto{
			MatchId:          m.ID,
			Start:            m.Start,
			End:              m.End,
			SportCenterId:    m.SportCenterId,
			SportCenterName:  m.SportCenter.Name,
			CostPerSection:   m.SportCenter.CostPerSection,
			MinutePerSection: m.SportCenter.MinutePerSection,
			Cost:             m.Cost,
			AdditionalCost:   m.CalcAdditionalCost(),
			Court:            m.Court,
			PlayerCount:      m.CalcPlayerCount(),
			RegistrationIds:  lo.Map(m.Registrations, func(reg domain.Registration, _ int) uint { return reg.ID }),
			IndividualCost:   m.CalcIndividualCost(),
		}
	})

	c.JSON(http.StatusOK, result)
}

func (h *MatchHandler) Delete(c *gin.Context) {
	matchId := params.Get(c, "matchId")
	if err := h.db.Delete(&domain.Match{}, matchId).Error; err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	c.Status(http.StatusOK)
}

func (h *MatchHandler) Create(c *gin.Context) {
	dto := dto.MatchDto{}
	var err error
	if err = c.BindJSON(&dto); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	h.logger.Debug(dto)

	sc := domain.SportCenter{}
	h.db.Find(&sc, dto.SportCenterId)

	m := domain.NewMatch(
		dto.Start,
		dto.End,
		dto.SportCenterId,
		sc.CostPerSection,
		float64(sc.MinutePerSection),
		dto.Court,
		dto.CustomSection,
	)

	h.logger.Debug(m)

	if err = h.db.Create(m).Error; err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusCreated, m)
}

func (h *MatchHandler) Clone(c *gin.Context) {
	matchId, _ := c.Params.Get("matchId")
	match := domain.Match{}
	if err := h.db.Find(&match, matchId).Error; err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	clone := match.Clone()
	if err := h.db.Create(&clone).Error; err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusCreated, clone)
}

func (h *MatchHandler) GetRegistrationsByMatch(c *gin.Context) {
	var result []dto.RegistrationOverviewDto
	matchId, _ := c.Params.Get("matchId")
	h.logger.Infof("getting match id %s", matchId)
	h.db.Raw(`
	SELECT
		pl.id AS player_id,
		TRIM(CONCAT(pl.first_name, ' ', pl.last_name)) AS player_name,
		pl.email,
		re.id AS registration_id,
		re.match_id,
		re.is_paid
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

	match.UpdateCost(dto.Cost, "Invalidate auto-calc cost, update manual")
	h.db.Save(&match)
	c.JSON(http.StatusOK, match)
}

func (h *MatchHandler) UpdateMatch(c *gin.Context) {
	matchId := params.Get(c, "matchId")
	dto := dto.UpdateMatchDto{}
	if err := c.BindJSON(&dto); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	match := domain.Match{}
	if err := h.db.Find(&match, matchId).Error; err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	sportCenterId, _ := strconv.Atoi(dto.SportCenterId)

	spc := &domain.SportCenter{}
	h.db.Find(&spc, sportCenterId)

	h.logger.Debugf("get sport center %v", spc)

	err := match.UpdateMatch(
		uint(sportCenterId),
		dto.Start,
		dto.End,
		float64(spc.MinutePerSection),
		spc.CostPerSection,
		dto.Court,
		dto.CustomSection,
	)

	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

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
	if err := h.db.Model(&domain.AdditionalCost{}).Where("match_id = ?", matchId).Select("amount").Scan(&costs).Error; err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	additionalCost := lo.Sum(costs)

	c.JSON(http.StatusOK, additionalCost)
}

func (h *MatchHandler) CreateAdditionalCost(c *gin.Context) {
	matchId := params.Get(c, "matchId")
	costs := []dto.AdditionalCostDto{}
	if err := c.BindJSON(&costs); err != nil {
		h.logger.Debugf("error parse dto: %v", err.Error())
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	match := domain.Match{}
	if err := h.db.Preload("AdditionalCosts").Find(&match, matchId).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": "match not found",
		})
		return
	}

	for _, c := range costs {
		match.AddCost(c.Description, c.Amount)
	}

	h.db.Save(&match)
	c.JSON(http.StatusOK, match)
}
