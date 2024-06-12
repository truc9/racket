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
	Court           string           `json:"court"`
	CustomSection   *float64         `gorm:"default:null" json:"customSection"`
	Comment         string           `json:"comment"`
}

func NewMatch(
	start,
	end time.Time,
	sportCenterId uint,
	costPerSection float64,
	minutePerSection float64,
	court string,
	customSection *float64,
) *Match {
	match := &Match{
		SportCenterId: sportCenterId,
		Start:         start,
		End:           end,
		Court:         court,
		CustomSection: customSection,
	}
	match.calculateCost(minutePerSection, costPerSection)
	return match
}

func (m *Match) UpdateMatch(
	sportCenterId uint,
	start,
	end time.Time,
	minutePerSection float64,
	costPerSection float64,
	court string,
	customSection *float64,
) error {
	if sportCenterId == 0 {
		return errors.New("sport center is invalid")
	}

	if end.Before(start) {
		return errors.New("end date must be equal or after start date")
	}

	m.SportCenterId = sportCenterId
	m.Start = start
	m.End = end
	m.Court = court
	m.CustomSection = customSection
	m.calculateCost(minutePerSection, costPerSection)

	return nil
}

func (m *Match) UpdateCost(cost float64, comment string) error {
	if cost <= 0 {
		return errors.New("invalid cost")
	}

	m.Cost = cost
	m.Comment = comment

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

func (m *Match) calculateCost(minutePerSection, costPerSection float64) float64 {
	totalMinutes := math.Abs(m.End.Sub(m.Start).Minutes())
	var sectionCount float64
	if m.CustomSection != nil {
		sectionCount = float64(*m.CustomSection)
	} else {
		sectionCount = totalMinutes / minutePerSection
	}

	m.Cost = sectionCount * costPerSection

	return m.Cost
}
