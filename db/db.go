package db

import (
	"log"
	"os"
	"sync"
	"time"

	"github.com/joho/godotenv"
	"github.com/truc9/racket/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	once sync.Once
	db   *gorm.DB
)

func NewDatabase() *gorm.DB {
	once.Do(func() {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}

		DB_CONN := os.Getenv("DB")

		dbCtx, err := gorm.Open(postgres.Open(DB_CONN), &gorm.Config{
			NowFunc: func() time.Time {
				return time.Now().UTC()
			},
		})

		if err != nil {
			log.Fatalln(err)
		}

		dbCtx.AutoMigrate(
			&domain.Player{},
			&domain.Match{},
			&domain.Registration{},
			&domain.AdditionalCost{},
			&domain.SportCenter{},
		)

		db = dbCtx.Debug()
	})

	return db
}
