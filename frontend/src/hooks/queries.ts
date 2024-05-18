import httpClient from '../common/httpClient'
import { MatchModel, PlayerModel, RegistrationDetailModel, RegistrationModel } from '../models'
import { useQuery } from '@tanstack/react-query'

export const usePlayersQuery = () => useQuery({
    initialData: [],
    queryKey: ['getPlayers'],
    queryFn: () => httpClient.get<PlayerModel[]>('api/v1/players'),
})

export const useMatchesQuery = () => useQuery({
    queryKey: ["getMatches"],
    queryFn: () => httpClient.get<MatchModel[]>("api/v1/matches"),
})

export const useRegistrationsQuery = () => useQuery({
    queryKey: ['getRegistrations'],
    queryFn: () => httpClient.get<RegistrationModel[]>("api/v1/registrations")
})

export const useRegistrationsByMatchQuery = (matchId: number) => useQuery({
    queryKey: ['getRegistrationsByMatch', matchId],
    queryFn: () => httpClient.get<RegistrationDetailModel[]>(`api/v1/matches/${matchId}/registrations`)
})