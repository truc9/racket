package dto

type CreateShareUrlDto struct {
	Url string `json:"url"`
}

type ValidateShareUrlDto struct {
	Url  string `json:"url"`
	Code string `json:"code"`
}
