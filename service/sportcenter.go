package service

import (
	"github.com/truc9/racket/domain"
	"github.com/truc9/racket/dto"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type SportCenterService struct {
	db     *gorm.DB
	logger *zap.SugaredLogger
}

func NewSportCenterService(db *gorm.DB, logger *zap.SugaredLogger) *SportCenterService {
	return &SportCenterService{
		db:     db,
		logger: logger,
	}
}

func (s *SportCenterService) GetAll() ([]dto.SportCenterDto, error) {
	var result []dto.SportCenterDto
	if err := s.db.Find(&result); err != nil {
		return nil, err.Error
	}
	return result, nil
}

func (s *SportCenterService) Create(name, location string) error {
	center := domain.NewSportCenter(name, location)
	err := s.db.Create(center).Error
	return err
}

func (s *SportCenterService) Update(id, name, location string) error {
	entity := domain.SportCenter{}

	if err := s.db.Find(&entity, id).Error; err != nil {
		return err
	}

	return nil
}
