package service

import (
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"gorm.io/gorm"
)

type PlayerService struct {
	db *gorm.DB
}

func NewPlayerService(db *gorm.DB) *PlayerService {
	return &PlayerService{
		db: db,
	}
}

func (s *PlayerService) GetPlayer(playerId uint) (*dto.PlayerDto, error) {
	model := &dto.PlayerDto{}
	err := s.db.Model(&domain.Player{}).
		Select("id as player_id, first_name, last_name").
		Where("id = ?", playerId).
		First(&model).
		Error

	if err != nil {
		return nil, err
	}

	return model, nil
}
