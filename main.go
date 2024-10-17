package main

import (
	"log"
	"net/url"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/truc9/racket/di"
	"github.com/truc9/racket/handler"

	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	adapter "github.com/gwatts/gin-adapter"
)

func main() {
	godotenv.Load()

	c := di.Register()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"https://getracket.vercel.app",
		},
		AllowMethods:     []string{"PUT", "POST", "GET", "DELETE", "PATCH"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "ok",
		})
	})

	issuerURL, _ := url.Parse(os.Getenv("AUTH0_ISSUER_URL"))
	audience := os.Getenv("AUTH0_AUDIENCE")
	provider := jwks.NewCachingProvider(issuerURL, time.Duration(5*time.Minute))

	jwtValidator, _ := validator.New(provider.KeyFunc,
		validator.RS256,
		issuerURL.String(),
		[]string{audience},
	)

	log.Printf("Audience: %s\n", audience)
	log.Printf("Issuer: %s\n", issuerURL)

	jwtMiddleware := jwtmiddleware.New(jwtValidator.ValidateToken)
	r.Use(adapter.Wrap(jwtMiddleware.CheckJWT))

	r.GET("/health/origins", func(ctx *gin.Context) {
		ctx.JSON(200, ctx.Request.Header.Get("Origin"))
	})

	v1 := r.Group("/api/v1")

	c.Invoke(func(handler *handler.MatchHandler) {
		v1.POST("/matches", handler.Create)
		v1.GET("/matches", handler.GetAll)
		v1.GET("/matches/archived", handler.GetArchivedMatches)
		v1.GET("/matches/future", handler.GetFutureMatches)
		v1.GET("/matches/today", handler.GetTodayMatches)
		v1.GET("/upcoming-matches", handler.GetUpcomingMatches)
		v1.GET("/matches/:matchId/registrations", handler.GetRegistrationsByMatch)
		v1.GET("/matches/:matchId/cost", handler.GetCost)
		v1.POST("/matches/:matchId/clone", handler.Clone)
		v1.GET("/matches/:matchId/additional-costs", handler.GetAdditionalCost)
		v1.PUT("/matches/:matchId", handler.UpdateMatch)
		v1.PUT("/matches/:matchId/costs", handler.UpdateCost)
		v1.PUT("/matches/:matchId/additional-costs", handler.CreateAdditionalCost)
		v1.DELETE("/matches/:matchId", handler.Delete)
	})

	c.Invoke(func(handler *handler.PlayerHandler) {
		v1.GET("/players", handler.GetAll)
		v1.GET("/players/external-users/:externalUserId/attendant-requests", handler.GetExternalUserAttendantRequests)
		v1.POST("/players", handler.Create)
		v1.POST("/players/:playerId/welcome-email", handler.SendWelcomeEmail)
		v1.DELETE("/players/:playerId", handler.Delete)
		v1.PUT("/players/:playerId", handler.Update)
		v1.PUT("/players/:playerId/outstanding-payments/paid", handler.MarkOutstandingPaymentsAsPaid)
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

	c.Invoke(func(handler *handler.ReportingHandler) {
		v1.GET("/reports/unpaid", handler.GetUnpaidReport)
	})

	c.Invoke(func(handler *handler.ActivityHandler) {
		v1.GET("/activities", handler.GetAll)
	})

	r.Run()
}
