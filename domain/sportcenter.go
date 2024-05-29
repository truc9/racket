package domain

import "errors"

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

func (sc *SportCenter) Update(name, location string) error {
	if len(name) == 0 {
		return errors.New("name is mandatory")
	}

	if len(location) == 0 {
		return errors.New("location is mandatory")
	}

	sc.Name = name
	sc.Location = location

	return nil
}
