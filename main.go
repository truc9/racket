package main

import (
	"github.com/gin-gonic/gin"
	"github.com/truc9/racket/db"
	"github.com/truc9/racket/handler"
)

func main() {
	route := gin.Default()
	db := db.CreateDB()
	matchHandler := handler.Match{Db: db}
	playerHandler := handler.Player{Db: db}
	regHandler := handler.Reg{Db: db}

	route.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "ok",
		})
	})

	v1 := route.Group("/api/v1")
	{
		v1.POST("/players", playerHandler.Create)
		v1.POST("/matches", matchHandler.Create)
		v1.GET("/matches", matchHandler.GetAll)
		v1.GET("/registrations", regHandler.GetAll)
		v1.POST("/registrations", regHandler.Create)
	}

	route.Run()
}
