package dto

type (
	CreateShareUrlDto struct {
		Url string `json:"url"`
	}

	ValidateShareUrlDto struct {
		Url  string `json:"url"`
		Code string `json:"code"`
	}

	ShareCodeDto struct {
		Id      uint   `json:"id"`
		FullUrl string `json:"fullUrl"`
	}
)
