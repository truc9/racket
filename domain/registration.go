package domain

type Registration struct {
	BaseModel
	PlayerId int64  `json:"playerId"`
	MatchId  int64  `json:"matchId"`
	IsPaid   bool   `json:"isPaid"`
	Comment  string `json:"comment"`
}

func (reg *Registration) MarkPaid() {
	reg.IsPaid = true
}

func (reg *Registration) MarkUnpaid() {
	reg.IsPaid = false
}
