package domain

import (
	"time"

	"gorm.io/gorm"
)

type (
	BaseModel struct {
		*gorm.Model
		ID        uint           `gorm:"primarykey" json:"id"`
		CreatedAt time.Time      `json:"createdAt"`
		UpdatedAt time.Time      `json:"updatedAt"`
		DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`
	}
	Player struct {
		BaseModel
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}

	Registration struct {
		BaseModel
		PlayerId int64  `json:"playerId"`
		MatchId  int64  `json:"matchId"`
		IsPaid   bool   `json:"isPaid"`
		Comment  string `json:"comment"`
	}

	Match struct {
		BaseModel
		Start    time.Time `json:"start"`
		End      time.Time `json:"end"`
		Location string    `json:"location"`
	}
)
