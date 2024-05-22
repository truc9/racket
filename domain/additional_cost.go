package domain

type AdditionalCost struct {
	BaseModel
	MatchId     uint    `json:"matchId"`
	Match       Match   `gorm:"foreignKey:MatchId" json:"match"`
	Description string  `json:"description"`
	Amount      float64 `json:"amount"`
}
