package domain

type Settings struct {
	BaseModel
	MessageTemplate string `json:"messageTemplate"`
}
