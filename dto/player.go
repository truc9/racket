package dto

type PlayerDto struct {
	PlayerId  int64  `json:"playerId"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}
