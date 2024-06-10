package domain

import (
	"errors"
	"math"
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

func NewMatch(
	start,
	end time.Time,
	sportCenterId uint,
	costPerSection float64,
	minutePerSection float64,
) *Match {
	totalMinutes := math.Abs(end.Sub(start).Minutes())
	sectionCount := totalMinutes / minutePerSection
	cost := sectionCount * costPerSection

	return &Match{
		SportCenterId: sportCenterId,
		Start:         start,
		End:           end,
		Cost:          cost,
	}
}

func (m *Match) UpdateMatch(sportCenterId uint, start, end time.Time) error {
	if sportCenterId == 0 {
		return errors.New("sport center is invalid")
	}

	if end.Before(start) {
		return errors.New("end date must be equal or after start date")
	}

	m.SportCenterId = sportCenterId
	m.Start = start
	m.End = end

	return nil
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
