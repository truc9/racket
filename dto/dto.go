package dto

import "time"

type (
	MatchDto struct {
		Start    time.Time `json:"start"`
		End      time.Time `json:"end"`
		Location string    `json:"location"`
	}

	PlayerDto struct {
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
	}

	RegistrationDto struct {
		PlayerId int64 `json:"playerId"`
		MatchId  int64 `json:"matchId"`
	}

	RegistrationOverviewDto struct {
	}
)
