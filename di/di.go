package di

import (
	"github.com/truc9/racket/db"
	"github.com/truc9/racket/handler"
	"github.com/truc9/racket/logger"
	"github.com/truc9/racket/service"
	"go.uber.org/dig"
)

func Register() *dig.Container {
	c := dig.New()

	// Infra
	c.Provide(db.NewDatabase)
	c.Provide(logger.NewLogger)

	// Handlers
	c.Provide(handler.NewMatchHandler)
	c.Provide(handler.NewPlayerHandler)
	c.Provide(handler.NewRegHandler)
	c.Provide(handler.NewSportCenterHandler)
	c.Provide(handler.NewSettingsHandler)
	c.Provide(handler.NewReportingHandler)
	c.Provide(handler.NewActivityHandler)
	c.Provide(handler.NewShareCodeHandler)

	// Services
	c.Provide(service.NewSportCenterService)
	c.Provide(service.NewReportingService)
	c.Provide(service.NewMatchService)
	c.Provide(service.NewPlayerService)
	c.Provide(service.NewActivityService)

	return c
}
