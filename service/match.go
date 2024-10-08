package service

import (
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"gorm.io/gorm"
)

type MatchService struct {
	db *gorm.DB
}

func NewMatchService(db *gorm.DB) *MatchService {
	return &MatchService{
		db: db,
	}
}

func (s *MatchService) GetMatchSummary(matchId uint) (*dto.MatchSummaryDto, error) {
	model := &dto.MatchSummaryDto{}
	err := s.db.Model(&domain.Match{}).
		Preload("sport_centers").
		Select("id as match_id, start, end, sport_centers.name as sport_center_name").
		Where("id = ?", matchId).
		First(&model).
		Error

	if err != nil {
		return nil, err
	}

	return model, nil
}
