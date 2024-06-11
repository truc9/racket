package dto

import "time"

type (
	MatchDto struct {
		MatchId          uint      `json:"matchId"`
		Start            time.Time `json:"start"`
		End              time.Time `json:"end"`
		SportCenterName  string    `json:"sportCenterName"`
		SportCenterId    uint      `json:"sportCenterId"`
		CostPerSection   float64   `json:"costPerSection"`
		MinutePerSection uint      `json:"minutePerSection"`
		Cost             float64   `json:"cost"`
	}

	AttendantDto struct {
		Name     string `json:"name"`
		MatchId  uint   `json:"matchId"`
		PlayerId uint   `json:"playerId"`
		IsJoined bool   `json:"isJoined"`
		IsPaid   bool   `json:"isPaid"`
	}

	UpdateMatchDto struct {
		SportCenterId string    `json:"sportCenterId"`
		Start         time.Time `json:"start"`
		End           time.Time `json:"end"`
	}

	MatchCostDto struct {
		Cost float64 `json:"cost"`
	}

	MatchStatDto struct {
		MatchId          uint    `json:"matchId"`
		TotalPlayer      uint    `json:"totalPlayer"`
		PaidCount        uint    `json:"paidCount"`
		UnpaidCount      uint    `json:"unpaidCount"`
		AttendantPercent float64 `json:"attendantPercent"`
		CourtCost        float64 `json:"courtCost"`
		ShuttlecockCost  float64 `json:"shuttlecockCost"`
	}
)
