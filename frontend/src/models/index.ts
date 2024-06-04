export interface ValueLabel {
    value: string
    label: string
}

export interface PlayerModel {
    id: number
    firstName: string
    lastName: string
}

export interface MatchSummaryModel {
    matchId: number
    sportCenterName: string
    sportCenterId: number
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

export interface SportCenterModel {
    id: number
    name: string
    location: string
    costPerSection: number
    minutePerSection: number
}

export interface AttendantRequestModel {
    matchId: number
    playerId: number
    sportCenterName: string
    sportCenterLocation: string
    start: Date
    end: Date
    isRequested: boolean
}

export type { AdditionalCost } from './cost/additional-cost'