package service

import "gorm.io/gorm"

type UnpaidByPlayer struct {
	PlayerId     uint    `json:"playerId"`
	PlayerName   string  `json:"playerName"`
	MatchCount   uint    `json:"matchCount"`
	UnpaidAmount float64 `json:"unpaidAmount"`
}

type ReportingService struct {
	db *gorm.DB
}

func NewReportingService(db *gorm.DB) *ReportingService {
	return &ReportingService{
		db: db,
	}
}

func (s *ReportingService) GetUnpaidReport() ([]UnpaidByPlayer, error) {
	result := []UnpaidByPlayer{}
	if err := s.db.Raw(`
	WITH cte_match_costs AS (
		SELECT 
			m.id AS match_id, 
			m.sport_center_id AS sport_center_id,
			m.cost / COUNT(r.id) AS individual_cost
		FROM matches m
		JOIN registrations r ON m.id = r.match_id
		GROUP BY m.id, m.sport_center_id
	)
	SELECT
		p.id AS player_id, 
		CONCAT(p.first_name,' ', p.last_name) AS player_name,
		COUNT(cte.match_id) AS match_count,
		SUM(cte.individual_cost) AS unpaid_amount
	FROM registrations r
	JOIN cte_match_costs cte ON cte.match_id = r.match_id
	JOIN sport_centers sc ON cte.sport_center_id = sc.id
	JOIN players p ON r.player_id = p.id
	WHERE r.is_paid = false	
	GROUP BY p.id
	ORDER by unpaid_amount DESC
	`).Scan(&result).Error; err != nil {
		return nil, err
	}
	return result, nil
}
