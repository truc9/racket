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
	match := &domain.Match{}
	err := s.db.Model(&domain.Match{}).
		Preload("SportCenter").
		Find(&match, matchId).
		Error

	if err != nil {
		return nil, err
	}

	return &dto.MatchSummaryDto{
		MatchId:         match.ID,
		Start:           match.Start,
		End:             match.End,
		SportCenterName: match.SportCenter.Name,
	}, nil
}
