package domain

import (
	"errors"
	"time"
)

type Match struct {
	BaseModel
	Start           time.Time        `json:"start"`
	End             time.Time        `json:"end"`
	SportCenterId   uint             `json:"sportCenterId"`
	Cost            float64          `json:"cost"`
	AdditionalCosts []AdditionalCost `json:"additionalCosts"`
	SportCenter     SportCenter      `json:"sportCenter"`
}

func (m *Match) UpdateCost(cost float64) error {
	if cost <= 0 {
		return errors.New("invalid cost")
	}

	m.Cost = cost

	return nil
}

func (m *Match) AddCost(description string, amount float64) error {
	cost, err := NewCost(m.ID, description, amount)
	if err != nil {
		return err
	}

	m.AdditionalCosts = append(m.AdditionalCosts, *cost)
	return nil
}
