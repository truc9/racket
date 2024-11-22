package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/internal/domain"
	"github.com/truc9/racket/internal/service"
	"github.com/truc9/racket/pkg/param"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type ReportingHandler struct {
	reportingSvc *service.ReportingService
	db           *gorm.DB
	logger       *zap.SugaredLogger
}

func NewReportingHandler(svc *service.ReportingService, db *gorm.DB, logger *zap.SugaredLogger) *ReportingHandler {
	return &ReportingHandler{
		reportingSvc: svc,
		db:           db,
		logger:       logger,
	}
}

func (h *ReportingHandler) GetUnpaidReport(c *gin.Context) {
	res, err := h.reportingSvc.GetUnpaidReport()
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *ReportingHandler) GetUnpaidReportForPublic(c *gin.Context) {
	shareCode := param.FromQuery(c, "shareCode")

	var count int64
	if err := h.db.Model(&domain.ShareCode{}).Where("code = ?", shareCode).Count(&count).Error; err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	if count == 0 {
		c.AbortWithError(http.StatusForbidden, errors.New("access denied"))
		return
	}

	res, err := h.reportingSvc.GetUnpaidReport()
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, res)
}
