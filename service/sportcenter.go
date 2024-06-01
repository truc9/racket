package service

import (
	"strconv"

	"github.com/samber/lo"
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
	sportCenters, err := s.getSportCenters()
	if err != nil {
		return nil, err
	}
	s.logger.Debug(sportCenters)

	result := lo.Map(sportCenters, func(item domain.SportCenter, _ int) dto.SportCenterDto {
		return dto.SportCenterDto{
			ID:               item.ID,
			Name:             item.Name,
			Location:         item.Location,
			CostPerSection:   item.CostPerSection,
			MinutePerSection: item.MinutePerSection,
		}
	})
	return result, nil
}

func (s *SportCenterService) Create(
	name,
	location string,
	costPerSection float64,
	minutePerSection uint,
) error {
	center := domain.NewSportCenter(name, location, costPerSection, minutePerSection)
	err := s.db.Create(center).Error
	return err
}

func (s *SportCenterService) Update(
	id,
	name,
	location string,
	costPerSection float64,
	minutePerSection uint,
) error {
	entity := domain.SportCenter{}

	if err := s.db.Find(&entity, id).Error; err != nil {
		return err
	}

	entity.Name = name
	entity.Location = location
	entity.CostPerSection = costPerSection
	entity.MinutePerSection = minutePerSection

	return s.db.Save(entity).Error
}

func (s *SportCenterService) GetOptions() ([]dto.SelectOption, error) {
	sportCenters, err := s.getSportCenters()
	if err != nil {
		return nil, err
	}
	s.logger.Debug(sportCenters)

	result := lo.Map(sportCenters, func(item domain.SportCenter, _ int) dto.SelectOption {
		return dto.SelectOption{
			Value: strconv.Itoa(int(item.ID)),
			Label: item.Name,
		}
	})
	return result, nil
}

func (s *SportCenterService) getSportCenters() ([]domain.SportCenter, error) {
	var sportCenters []domain.SportCenter
	err := s.db.Order("name ASC").Find(&sportCenters).Error
	return sportCenters, err
}
