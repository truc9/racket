import httpClient from '../common/httpClient'
import { RegistrationDetailModel } from '../models'

async function getRegistrationByMatch(matchId: number) {
    return await httpClient.get<RegistrationDetailModel[]>(`api/v1/matches/${matchId}/registrations`)
}

export default {
    getRegistrationByMatch
}