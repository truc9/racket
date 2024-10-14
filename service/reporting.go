package service

import "gorm.io/gorm"

type UnpaidByPlayer struct {
	PlayerId            uint    `json:"playerId"`
	PlayerName          string  `json:"playerName"`
	MatchCount          uint    `json:"matchCount"`
	UnpaidAmount        float64 `json:"unpaidAmount"`
	RegistrationSummary string  `json:"registrationSummary"`
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
	),
	cte_match_additional_costs AS (
		SELECT 
			m.id AS match_id,
			SUM (ac.amount) / COUNT(r.id) AS individual_additional_cost
		FROM matches m
		JOIN registrations r ON m.id = r.match_id
		JOIN additional_costs ac on ac.match_id = m.id
		GROUP BY m.id
	),
	cte_registration_history AS (
		SELECT p.id AS player_id, STRING_AGG(TO_CHAR(m.start, 'DD-Mon'), ', ' ORDER BY m.start) AS registration_summary
		FROM registrations r
		JOIN matches m ON m.id = r.match_id
		JOIN players p on p.id = r.player_id
		WHERE r.is_paid = false
		GROUP BY p.id
	)
	SELECT
		p.id AS player_id, 
		CONCAT(p.first_name,' ', p.last_name) AS player_name,
		COUNT(cte.match_id) AS match_count,
		SUM(cte.individual_cost + COALESCE(cte3.individual_additional_cost, 0)) AS unpaid_amount,
		cte2.registration_summary
	FROM registrations r
	JOIN cte_match_costs cte ON cte.match_id = r.match_id
	JOIN sport_centers sc ON cte.sport_center_id = sc.id
	JOIN players p ON r.player_id = p.id
	JOIN cte_registration_history cte2 ON cte2.player_id = p.id
	LEFT JOIN cte_match_additional_costs cte3 ON cte3.match_id = r.match_id
	WHERE r.is_paid = false	
	GROUP BY p.id, cte2.registration_summary
	ORDER by unpaid_amount DESC
	`).Scan(&result).Error; err != nil {
		return nil, err
	}
	return result, nil
}
