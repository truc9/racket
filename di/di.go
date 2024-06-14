package di

import (
	"github.com/truc9/racket/db"
	"github.com/truc9/racket/handler"
	"github.com/truc9/racket/logger"
	"github.com/truc9/racket/service"
	"github.com/truc9/racket/service/email"
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

	// Services
	c.Provide(service.NewSportCenterService)
	c.Provide(email.NewResendEmailer)

	return c
}
