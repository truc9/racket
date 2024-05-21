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
		player := v1.Group("/players")
		{
			player.GET("", playerHandler.GetAll)
			player.POST("", playerHandler.Create)
			player.PUT("/:playerId", playerHandler.Update)
			player.DELETE("/:playerId", playerHandler.Delete)
		}

		match := v1.Group("/matches")
		{
			match.POST("", matchHandler.Create)
			match.GET("", matchHandler.GetAll)
			match.GET("/:matchId/registrations", matchHandler.GetRegistrationsByMatch)
		}

		reg := v1.Group("/registrations")
		{
			reg.GET("", regHandler.GetAll)
			reg.POST("", regHandler.Register)
			reg.PUT("/:registrationId/paid", regHandler.MarkPaid)
			reg.PUT("/:registrationId/unpaid", regHandler.MarkUnPaid)
			reg.DELETE("/:registrationId", regHandler.Unregister)
		}
	}

	router.Run()
}
