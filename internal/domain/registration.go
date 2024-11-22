package domain

type Registration struct {
	BaseModel
	PlayerId uint   `json:"playerId"`
	MatchId  uint   `json:"matchId"`
	IsPaid   bool   `json:"isPaid"`
	Comment  string `json:"comment"`
}

func (reg *Registration) MarkPaid() {
	reg.IsPaid = true
}

func (reg *Registration) MarkUnpaid() {
	reg.IsPaid = false
}
