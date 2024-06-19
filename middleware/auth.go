package middleware

import (
	"log"

	"github.com/gin-gonic/gin"
)

func CheckAuth() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		log.Println("pre middleware")
		ctx.Next()
		log.Println("post middleware")
	}
}
