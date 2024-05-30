package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/di"
	"github.com/truc9/racket/handler"
)

func main() {
	// Register Container
	c := di.Register()

	// Gin Router
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://goodracket.vercel.app"},
		AllowMethods:     []string{"PUT", "POST", "GET", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health Check
	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "ok",
		})
	})

	r.GET("/health/origins", func(ctx *gin.Context) {
		ctx.JSON(200, ctx.Request.Header.Get("Origin"))
	})

	// API v1
	v1 := r.Group("/api/v1")

	c.Invoke(func(handler *handler.MatchHandler) {
		// Matches API
		v1.POST("/matches", handler.Create)
		v1.GET("/matches", handler.GetAll)
		v1.GET("/matches/:matchId/registrations", handler.GetRegistrationsByMatch)
		v1.GET("/matches/:matchId/costs", handler.GetCost)
		v1.GET("/matches/:matchId/additional-costs", handler.GetAdditionalCost)
		v1.PUT("/matches/:matchId/costs", handler.UpdateCost)
		v1.PUT("/matches/:matchId/additional-costs", handler.CreateAdditionalCost)
	})

	c.Invoke(func(handler *handler.PlayerHandler) {
		// Players API
		v1.GET("/players", handler.GetAll)
		v1.POST("/players", handler.Create)
		v1.DELETE("/players/:playerId", handler.Delete)
		v1.PUT("/players/:playerId", handler.Update)
	})

	c.Invoke(func(handler *handler.RegistrationHandler) {
		// Registrations API
		v1.GET("/registrations", handler.GetAll)
		v1.POST("/registrations", handler.Register)
		v1.PUT("/registrations/:registrationId/paid", handler.MarkPaid)
		v1.PUT("/registrations/:registrationId/unpaid", handler.MarkUnPaid)
		v1.DELETE("/registrations/:registrationId", handler.Unregister)
	})

	c.Invoke(func(handler *handler.SportCenterHandler) {
		// Sport Centers API
		v1.GET("/sportcenters", handler.GetAll)
		v1.GET("/sportcenters/options", handler.GetOptions)
		v1.POST("/sportcenters", handler.Create)
		v1.PUT("/sportcenters/:sportCenterId", handler.Update)
	})

	r.Run()
}
