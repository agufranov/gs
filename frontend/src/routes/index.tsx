import { useProfile, useSignOut } from '@/modules/auth/queries'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const signOut = useSignOut()
  const profile = useProfile()

  return (
    <div>
      {!profile.isLoading && !profile.data && <Navigate to="/signIn" />}
      {profile.data && (
        <>
          <div>{JSON.stringify(profile.data)}</div>
          <button onClick={() => signOut.mutateAsync()}>Sign out</button>
        </>
      )}
    </div>
  )
}
