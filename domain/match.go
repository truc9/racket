package domain

import (
	"errors"
	"time"
)

type Match struct {
	BaseModel
	Start           time.Time        `json:"start"`
	End             time.Time        `json:"end"`
	Location        string           `json:"location"`
	Cost            float64          `json:"cost"`
	AdditionalCosts []AdditionalCost `json:"additionalCosts"`
}

func (m *Match) UpdateCost(cost float64) error {
	if cost <= 0 {
		return errors.New("invalid cost")
	}

	m.Cost = cost

	return nil
}
