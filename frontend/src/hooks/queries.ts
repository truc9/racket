import httpService from '../common/http-service'
import { MatchSummaryModel, PlayerModel, RegistrationDetailModel, RegistrationModel } from '../models'
import { useQuery } from '@tanstack/react-query'

export const usePlayersQuery = () => useQuery({
    initialData: [],
    queryKey: ['getPlayers'],
    queryFn: () => httpService.get<PlayerModel[]>('api/v1/players'),
})

export const useMatchesQuery = () => useQuery({
    queryKey: ["getMatches"],
    queryFn: () => httpService.get<MatchSummaryModel[]>("api/v1/matches"),
})

export const useRegistrationsQuery = () => useQuery({
    queryKey: ['getRegistrations'],
    queryFn: () => httpService.get<RegistrationModel[]>("api/v1/registrations")
})

export const useRegistrationsByMatchQuery = (matchId: number) => useQuery({
    queryKey: ['getRegistrationsByMatch', matchId],
    queryFn: () => httpService.get<RegistrationDetailModel[]>(`api/v1/matches/${matchId}/registrations`)
})