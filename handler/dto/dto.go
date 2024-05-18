package dto

import "time"

type (
	MatchDto struct {
		MatchId  int64     `json:"matchId"`
		Start    time.Time `json:"start"`
		End      time.Time `json:"end"`
		Location string    `json:"location"`
	}

	PlayerDto struct {
		PlayerId  int64  `json:"playerId"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}

	RegistrationDto struct {
		PlayerId int64 `json:"playerId"`
		MatchId  int64 `json:"matchId"`
	}

	AttendantDto struct {
		Name     string `json:"name"`
		MatchId  int64  `json:"matchId"`
		PlayerId int64  `json:"playerId"`
		IsJoined bool   `json:"isJoined"`
		IsPaid   bool   `json:"isPaid"`
	}

	RegistrationOverviewDto struct {
		RegistrationId int64  `json:"registrationId"`
		MatchId        int64  `json:"matchId"`
		PlayerId       int64  `json:"playerId"`
		PlayerName     string `json:"playerName"`
		IsPaid         bool   `json:"isPaid"`
	}
)
