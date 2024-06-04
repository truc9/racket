package dto

import "time"

type (
	RegistrationOverviewDto struct {
		RegistrationId uint   `json:"registrationId"`
		MatchId        uint   `json:"matchId"`
		PlayerId       uint   `json:"playerId"`
		PlayerName     string `json:"playerName"`
		IsPaid         bool   `json:"isPaid"`
	}

	RegistrationDto struct {
		PlayerId uint `json:"playerId"`
		MatchId  uint `json:"matchId"`
	}

	AttendantRequestDto struct {
		FirstName      string `json:"firstName"`
		LastName       string `json:"lastName"`
		Email          string `json:"email"`
		ExternalUserId string `json:"externalUserId"`
		MatchId        uint   `json:"matchId"`
	}

	PlayerAttendantRequestDto struct {
		MatchId             uint      `json:"matchId"`
		PlayerId            uint      `json:"playerId"`
		Start               time.Time `json:"start"`
		End                 time.Time `json:"end"`
		SportCenterName     string    `json:"sportCenterName"`
		SportCenterLocation string    `json:"sportCenterLocation"`
		IsRequested         bool      `json:"isRequested"`
	}
)
