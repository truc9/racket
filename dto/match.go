package dto

import "time"

type (
	MatchDto struct {
		MatchId  int64     `json:"matchId"`
		Start    time.Time `json:"start"`
		End      time.Time `json:"end"`
		Location string    `json:"location"`
	}

	AttendantDto struct {
		Name     string `json:"name"`
		MatchId  int64  `json:"matchId"`
		PlayerId int64  `json:"playerId"`
		IsJoined bool   `json:"isJoined"`
		IsPaid   bool   `json:"isPaid"`
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
