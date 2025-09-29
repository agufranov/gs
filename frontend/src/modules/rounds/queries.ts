import { client } from '@/client'
import type { RoundResponse } from '@gs/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useRounds = () => {
  return useQuery<RoundResponse[]>({
    queryKey: ['rounds'],
    queryFn: () => client.get('/rounds'),
  })
}

export const useRound = (id: number) => {
  return useQuery<RoundResponse>({
    queryKey: ['round', id],
    queryFn: () => client.get(`/rounds/${id}`),
    enabled: Number.isFinite(id),
  })
}

export const useCreateRound = () => {
  const queryClient = useQueryClient()

  return useMutation<RoundResponse, never, null>({
    mutationKey: ['createRound'],
    mutationFn: () => client.post('/rounds'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] })
    },
  })
}

export const useJoinRound = () => {
  return useMutation<never, string, { id: RoundResponse['id'] }>({
    mutationKey: ['joinRound'],
    mutationFn: ({ id }) => client.post(`/rounds/${id}/join`),
  })
}

export const useTap = (id: RoundResponse['id']) => {
  const queryClient = useQueryClient()

  return useMutation<never, never, null>({
    mutationKey: ['tap'],
    mutationFn: () => client.post(`/rounds/${id}/tap`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['round', id] }),
  })
}
