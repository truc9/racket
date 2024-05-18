export interface PlayerModel {
    id: number
    firstName: string
    lastName: string
}

export interface MatchModel {
    id: number
    location: string
    start: Date
    end: Date
}

export interface RegistrationDetailModel {
    registrationId: number
    matchId: number
    playerId: number
    playerName: string
    isPaid: boolean
}

export interface RegistrationModel {
    playerId: number
    matchId: number
}