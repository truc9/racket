package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/service"
)

type ReportingHandler struct {
	reportingSvc *service.ReportingService
}

func NewReportingHandler(svc *service.ReportingService) *ReportingHandler {
	return &ReportingHandler{
		reportingSvc: svc,
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
