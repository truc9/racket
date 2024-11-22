package dto

type (
	SportCenterDto struct {
		ID               uint    `json:"id"`
		Name             string  `json:"name"`
		Location         string  `json:"location"`
		CostPerSection   float64 `json:"costPerSection"`
		MinutePerSection uint    `json:"minutePerSection"`
	}
)
