import httpService from '../common/http-service'
import { RegistrationDetailModel } from '../models'

async function getRegistrationByMatch(matchId: number) {
    return await httpService.get<RegistrationDetailModel[]>(`api/v1/matches/${matchId}/registrations`)
}

export default {
    getRegistrationByMatch
}