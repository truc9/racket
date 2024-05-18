package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	database "github.com/truc9/racket/db"
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

	db := database.CreateDB()
	logger, _ := zap.NewDevelopment()
	defer logger.Sync()
	sugar := logger.Sugar()

	matchHandler := handler.NewMatchHandler(db, sugar)
	playerHandler := handler.NewPlayerHandler(db, sugar)
	regHandler := handler.NewRegHandler(db, sugar)

	// Healthcheck
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
