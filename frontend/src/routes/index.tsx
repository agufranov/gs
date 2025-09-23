import { useProfile, useSignIn, useSignOut } from '@/modules/auth/queries'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const signIn = useSignIn()
  const signOut = useSignOut()
  const profile = useProfile()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    console.log(username, password)
    await signIn.mutateAsync({ username, password })
    queryClient.invalidateQueries({ queryKey: ['profile'] })
  }

  return (
    <div>
      {!profile.data && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" />
          <input type="password" name="password" />
          <button type="submit">Submit</button>
        </form>
      )}
      {profile.data && (
        <>
          <div>{JSON.stringify(profile.data)}</div>
          <button onClick={() => signOut.mutateAsync()}>Sign out</button>
        </>
      )}
    </div>
  )
}
