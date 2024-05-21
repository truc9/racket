package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/db"
	"github.com/truc9/racket/handler"
	"go.uber.org/zap"
)

func main() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://goodracket.vercel.app"},
		AllowMethods:     []string{"PUT", "POST", "GET", "DELETE", "PATCH"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	database := db.NewDatabase()
	sqldb, _ := database.DB()
	defer sqldb.Close()

	var logger *zap.Logger

	logger, _ = zap.NewDevelopment()

	defer logger.Sync()
	sugar := logger.Sugar()

	matchHandler := handler.NewMatchHandler(database, sugar)
	playerHandler := handler.NewPlayerHandler(database, sugar)
	regHandler := handler.NewRegHandler(database, sugar)

	// Health Check
	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "ok",
		})
	})

	// API v1
	v1 := router.Group("/api/v1")
	{
		v1.GET("/players", playerHandler.GetAll)
		v1.POST("/players", playerHandler.Create)
		v1.DELETE("/players/:playerId", playerHandler.Delete)
		v1.PUT("/players/:playerId", playerHandler.Update)

		v1.POST("/matches", matchHandler.Create)
		v1.GET("/matches", matchHandler.GetAll)
		v1.GET("/matches/:matchId/registrations", matchHandler.GetRegistrationsByMatch)

		v1.GET("/registrations", regHandler.GetAll)
		v1.POST("/registrations", regHandler.Register)
		v1.PUT("/registrations/:registrationId/paid", regHandler.MarkPaid)
		v1.PUT("/registrations/:registrationId/unpaid", regHandler.MarkUnPaid)
		v1.DELETE("/registrations/:registrationId", regHandler.Unregister)
	}

	router.Run()
}
