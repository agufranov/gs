import { useProfile } from '@/modules/auth/queries'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const profile = useProfile()

  return (
    <div>
      {!profile.isLoading &&
        (profile.data ? <Navigate to="/rounds" /> : <Navigate to="/signIn" />)}
      {profile.isLoading && 'Loading...'}
    </div>
  )
}
