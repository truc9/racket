package activity

import (
	"errors"

	"github.com/truc9/racket/domain"
)

type ActivityType = int

const (
	MatchRegistered         ActivityType = iota + 1 //1
	MatchUnRegistered                               //2
	MatchCreated                                    //2
	MatchUpdated                                    //3
	MatchDeleted                                    //4
	SportCenterCreated                              //5
	SportCenterUpdated                              //6
	SportCenterPriceChanged                         //7
)

type Activity struct {
	domain.BaseModel
	TypeId      ActivityType `json:"typeId"`
	Description string       `json:"description"`
}

func CreateActivityLog(typeId ActivityType, description string) (*Activity, error) {
	if len(description) == 0 {
		return nil, errors.New("description is mandatory")
	}

	return &Activity{
		TypeId:      typeId,
		Description: description,
	}, nil
}
