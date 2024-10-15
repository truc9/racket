# 🧜‍♀️ RACKET

[![Go](https://github.com/truc9/racket/actions/workflows/go.yml/badge.svg)](https://github.com/truc9/racket/actions/workflows/go.yml) [![CodeQL Advanced](https://github.com/truc9/racket/actions/workflows/codeql.yml/badge.svg)](https://github.com/truc9/racket/actions/workflows/codeql.yml)

## Overview
An app for amature badminton player self-organized group, manage players, courts, costs

> [!NOTE]
This project for personal hobby and learning purpose

## Usage
### Environment Variables

Backend
```
DB=postgres://postgres:admin@localhost:5434/racket?sslmode=disable
AUTH0_ISSUER_URL=
AUTH0_AUDIENCE=
```
Frontend
```
VITE_API_HOST=http://localhost:8080
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENTID=
VITE_AUTH0_AUDIENCE=
```
## Docker
```bash
docker compose up
```

## Roadmap
- [x] Auth0 Integration
- [x] Docker support
- [x] Registration dashboard  
- [x] Players management
- [x] Matches management
- [x] Duplicate match
- [x] Unpaid report
- [x] Support cost management
- [ ] Support notification (Facebook Messenger, Email, Push Notification)
- [ ] Monzo API Integration
- [ ] Support Mobile Devices (iOS, Android)
- [ ] Testing high coverage

## Demo
![demo](art/iPad-PRO-11-dashboard.png "Dashboard")

![demo](art/iPad-PRO-11-players.png "Players")

![demo](art/iPad-PRO-11-matches.png "Matches")

![demo](art/iPad-Air-4-unpaid-report.png "Unpaid Report")

![demo](art/iPad-PRO-11-sportcenters.png "Sport Centers")

## Stack
- Golang Gin
- GORM with Postgres
- Auth0
- React
- Tailwindcss
- Dayjs
- Mantine UI
- Numerable


## Dev Guidline
### Run test
```bash
go test -v ./...
go test -v -cover ./...
```

## Hosting
- Backend: https://www.koyeb.com/
- Frontend: https://vercel.com/
