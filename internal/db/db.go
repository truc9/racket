package db

import (
	"log"
	"os"
	"sync"
	"time"

	"github.com/truc9/racket/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	once sync.Once
	db   *gorm.DB
)

func NewDatabase() *gorm.DB {
	once.Do(func() {
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
			&domain.Settings{},
			&domain.Activity{},
			&domain.ShareCode{},
		)

		db = dbCtx.Debug()
	})

	return db
}
