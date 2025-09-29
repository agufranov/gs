import { client } from '@/client'
import type { SignInRequest, UserResponse } from '@gs/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation<never, never, SignInRequest>({
    mutationKey: ['signIn'],
    mutationFn: ({ username, password }) =>
      client.post('/auth/signIn', { username, password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export const useSignOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['signOut'],
    mutationFn: () => client.post('/auth/signOut'),
    onSuccess: () => queryClient.setQueryData(['profile'], null),
  })
}

export const useProfile = () =>
  useQuery<UserResponse>({
    queryKey: ['profile'],
    queryFn: () => client.get('/auth/profile'),
    retry: false,
    refetchOnMount: false,
  })
