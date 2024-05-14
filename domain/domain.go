package domain

import (
	"time"

	"gorm.io/gorm"
)

type (
	Player struct {
		gorm.Model
		Id        int64  `gorm:"primaryKey" json:"id"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}
	Registration struct {
		gorm.Model
		Id       int64  `gorm:"primaryKey" json:"id"`
		PlayerId int64  `json:"playerId"`
		MatchId  int64  `json:"matchId"`
		IsPaid   bool   `json:"isPaid"`
		Comment  string `json:"comment"`
	}
	Match struct {
		gorm.Model
		Id       int64     `gorm:"primaryKey" json:"id"`
		Start    time.Time `json:"start"`
		End      time.Time `json:"end"`
		Location string    `json:"location"`
	}
)
