package db

import (
	"log"
	"sync"
	"time"

	"github.com/truc9/racket/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	once sync.Once
	db   *gorm.DB
)

func CreateDB() *gorm.DB {
	once.Do(func() {
		dbCtx, err := gorm.Open(postgres.Open("postgres://postgres:admin@localhost:5432/racket?sslmode=disable"), &gorm.Config{
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
		)
		db = dbCtx
	})

	return db
}
