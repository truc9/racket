package domain

type Player struct {
	BaseModel
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	ExternalUserId string `json:"externalUserId"`
	Email          string `json:"email"`
	Rank           uint   `json:"rank"`
}
