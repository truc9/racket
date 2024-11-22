package dto

type PlayerSummaryDto struct {
	PlayerId  uint   `json:"playerId"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}
