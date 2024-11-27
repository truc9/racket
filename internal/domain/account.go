package domain

import "errors"

type TransactionType = int

const (
	In TransactionType = iota + 1
	Out
)

type (
	Account struct {
		BaseModel
		PlayerId     uint                  `json:"playerId"`
		Balance      float64               `json:"balance"`
		Transactions []*AccountTransaction `json:"transactions"`
	}

	AccountTransaction struct {
		BaseModel
		Amount          float64         `json:"amount"`
		AccountId       uint            `json:"accountId"`
		TransactionType TransactionType `json:"transactionType"`
		Description     string          `json:"description"`
	}
)

func NewAccount(playerId uint) *Account {
	return &Account{
		PlayerId: playerId,
		Balance:  0,
	}
}

func newAccountWithInitAmount(playerId uint, initAmount float64) *Account {
	return &Account{
		PlayerId: playerId,
		Balance:  initAmount,
	}
}

func (a *Account) addTransaction(tranType TransactionType, amount float64, description string) {
	tran := &AccountTransaction{
		AccountId:       a.ID,
		TransactionType: tranType,
		Description:     description,
		Amount:          amount,
	}
	a.Transactions = append(a.Transactions, tran)
}

func (a *Account) Credit(amount float64, description string) error {
	if amount <= 0 {
		return errors.New("amount must be positive")
	}
	a.Balance += amount
	a.addTransaction(In, amount, description)
	return nil
}

func (a *Account) Debit(amount float64, description string) error {
	if amount > a.Balance {
		return errors.New("insufficient fun to debit")
	}
	a.Balance -= amount
	a.addTransaction(Out, amount, description)

	return nil
}
