package email

type Emailer interface {
	Send(from string, to []string, subject, body string) (*EmailerRes, error)
}
