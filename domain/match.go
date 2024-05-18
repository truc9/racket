package domain

import "time"

type Match struct {
	BaseModel
	Start    time.Time `json:"start"`
	End      time.Time `json:"end"`
	Location string    `json:"location"`
}
