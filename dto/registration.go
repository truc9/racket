package dto

type (
	RegistrationOverviewDto struct {
		RegistrationId int64  `json:"registrationId"`
		MatchId        int64  `json:"matchId"`
		PlayerId       int64  `json:"playerId"`
		PlayerName     string `json:"playerName"`
		IsPaid         bool   `json:"isPaid"`
	}

	RegistrationDto struct {
		PlayerId int64 `json:"playerId"`
		MatchId  int64 `json:"matchId"`
	}
)
