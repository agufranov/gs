import { useProfile, useSignIn } from '@/modules/auth/queries'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/signIn')({
  component: SignInRoute,
})

function SignInRoute() {
  const signIn = useSignIn()
  const profile = useProfile()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    await signIn.mutateAsync({ username, password })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value="admin"
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value="1"
          placeholder="Password"
        />
        <button type="submit" disabled={signIn.isPending || profile.isFetching}>
          Submit
        </button>
      </form>
      {profile.data && <Navigate to="/" />}
    </div>
  )
}
