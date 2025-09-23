import { client } from '@/client'
import type { RoundResponse } from '@backend-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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
