# 🧜‍♀️ RACKET

[![Go](https://github.com/truc9/racket/actions/workflows/go.yml/badge.svg)](https://github.com/truc9/racket/actions/workflows/go.yml) [![CodeQL Advanced](https://github.com/truc9/racket/actions/workflows/codeql.yml/badge.svg)](https://github.com/truc9/racket/actions/workflows/codeql.yml)

## Overview
An app for amature badminton player self-organized group, manage players, courts, costs

> [!NOTE]
This project for personal hobby and learning purpose

## Usage
Must provide your own Auth0 keys in docker compose frontend service
```
environment:
    - VITE_AUTH0_DOMAIN=
    - VITE_AUTH0_CLIENTID=
```

```bash
docker compose up
```

## Roadmap
- [x] Registration dashboard  
- [x] Players management
- [x] Matches management
- [x] Duplicate match
- [x] Unpaid report
- [ ] Backend authorization
- [x] Docker support
- [x] Support cost management
- [ ] Support notification (Facebook Messenger, Email, Push Notification)
- [ ] Mobile Apps
- [ ] Testing

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
