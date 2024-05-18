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
)
