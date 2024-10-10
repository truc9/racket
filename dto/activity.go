package dto

import (
	"time"

	"github.com/truc9/racket/domain/activity"
)

type ActivityDto struct {
	TypeId      activity.ActivityType `json:"typeId"`
	TypeName    string                `json:"typeName"`
	Description string                `json:"description"`
	Payload     string                `json:"payload"`
	CreatedDate time.Time             `json:"createdDate"`
}
