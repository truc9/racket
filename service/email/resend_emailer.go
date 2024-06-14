package email

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	resend "github.com/resend/resend-go/v2"
)

type ResendEmailer struct {
}

func NewResendEmailer() Emailer {
	return &ResendEmailer{}
}

func (re *ResendEmailer) Send(from string, to []string, subject, body string) (*EmailerRes, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	API_KEY := os.Getenv("RESEND_API_KEY")

	client := resend.NewClient(API_KEY)

	params := &resend.SendEmailRequest{
		From:    "The Racket <truc.nguyen.dev@gmail.com>",
		To:      to,
		Html:    body,
		Subject: subject,
	}

	sent, err := client.Emails.Send(params)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	fmt.Println(sent.Id)

	return &EmailerRes{
		Id: sent.Id,
	}, err
}
