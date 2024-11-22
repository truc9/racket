package dto

type (
	AdditionalCostDto struct {
		Description string  `json:"description"`
		Amount      float64 `json:"amount"`
	}
)
