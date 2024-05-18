package domain

type Player struct {
	BaseModel
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}
