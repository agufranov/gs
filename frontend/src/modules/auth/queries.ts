import { client } from '@/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useSignIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['signIn'],
    mutationFn: ({
      username,
      password,
    }: {
      username: string
      password: string
    }) =>
      client
        .post('/auth/signIn', { username, password })
        .then(({ data }) => data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })
}

export const useSignOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['signOut'],
    mutationFn: () => client.post('/auth/signOut').then(({ data }) => data),
    onSuccess: () => queryClient.setQueryData(['profile'], null),
  })
}

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/auth/profile').then(({ data }) => data),
  })
