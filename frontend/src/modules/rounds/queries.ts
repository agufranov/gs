import { client } from '@/client'
import type { RoundResponse } from '@backend-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useRounds = () => {
  return useQuery<RoundResponse[]>({
    queryKey: ['rounds'],
    queryFn: () => client.get('/rounds'),
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
  return useMutation<{}, never, { id: RoundResponse['id'] }>({
    mutationKey: ['createRound'],
    mutationFn: ({ id }) => client.post(`/rounds/${id}/join`),
  })
}
