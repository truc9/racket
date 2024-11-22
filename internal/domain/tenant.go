package domain

import (
	"time"

	"gorm.io/gorm"
)

type Tenant struct {
	*gorm.Model
	ID        uint           `gorm:"primarykey" json:"id"`
	Name      string         `json:"name"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`
}

func NewTenant(name string) *Tenant {
	return &Tenant{
		Name:      name,
		CreatedAt: time.Now().UTC(),
	}
}
