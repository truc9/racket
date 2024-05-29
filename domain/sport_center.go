package domain

type SportCenter struct {
	BaseModel
	Name     string `json:"name"`
	Location string `json:"location"`
}

func NewSportCenter(name, location string) *SportCenter {
	return &SportCenter{
		Name:     name,
		Location: location,
	}
}
