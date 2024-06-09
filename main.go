package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/di"
	"github.com/truc9/racket/handler"
)

func main() {
	c := di.Register()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://getracket.vercel.app"},
		AllowMethods:     []string{"PUT", "POST", "GET", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "ok",
		})
	})

	r.GET("/health/origins", func(ctx *gin.Context) {
		ctx.JSON(200, ctx.Request.Header.Get("Origin"))
	})

	v1 := r.Group("/api/v1")

	c.Invoke(func(handler *handler.MatchHandler) {
		v1.POST("/matches", handler.Create)
		v1.GET("/matches", handler.GetAll)
		v1.GET("/upcoming-matches", handler.GetUpcomingMatches)
		v1.GET("/matches/:matchId/registrations", handler.GetRegistrationsByMatch)
		v1.GET("/matches/:matchId/cost", handler.GetCost)
		v1.GET("/matches/:matchId/additional-costs", handler.GetAdditionalCost)
		v1.PUT("/matches/:matchId/costs", handler.UpdateCost)
		v1.PUT("/matches/:matchId/additional-costs", handler.CreateAdditionalCost)
		v1.DELETE("/matches/:matchId", handler.Delete)
	})

	c.Invoke(func(handler *handler.PlayerHandler) {
		v1.GET("/players", handler.GetAll)
		v1.GET("/players/external-users/:externalUserId/attendant-requests", handler.GetExternalUserAttendantRequests)
		v1.POST("/players", handler.Create)
		v1.DELETE("/players/:playerId", handler.Delete)
		v1.PUT("/players/:playerId", handler.Update)
	})

	c.Invoke(func(handler *handler.RegistrationHandler) {
		v1.GET("/registrations", handler.GetAll)
		v1.POST("/registrations", handler.Register)
		v1.POST("/registrations/attendant-requests", handler.AttendantRequest)
		v1.PUT("/registrations/:registrationId/paid", handler.MarkPaid)
		v1.PUT("/registrations/:registrationId/unpaid", handler.MarkUnPaid)
		v1.DELETE("/registrations/:registrationId", handler.Unregister)
	})

	c.Invoke(func(handler *handler.SportCenterHandler) {
		v1.GET("/sportcenters", handler.GetAll)
		v1.GET("/sportcenters/options", handler.GetOptions)
		v1.POST("/sportcenters", handler.Create)
		v1.PUT("/sportcenters/:sportCenterId", handler.Update)
	})

	c.Invoke(func(handler *handler.SettingsHandler) {
		v1.GET("/settings/message-template", handler.GetMessageTemplate)
		v1.POST("/settings/message-template", handler.CreateMessageTemplate)
	})

	r.Run()
}
