import { useProfile } from '@/modules/auth/queries'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const profile = useProfile()

  return (
    <div>
      {!profile.isLoading && !profile.data && <Navigate to="/signIn" />}
      {!profile.isLoading && profile.data && (
        <Navigate to="/rounds" />
        // <>
        //   <div>{JSON.stringify(profile.data)}</div>
        //   <button
        //     onClick={() => signOut.mutateAsync()}
        //     disabled={signOut.isPending}
        //   >
        //     Sign out
        //   </button>
        // </>
      )}
      {profile.isLoading && 'Loading...'}
    </div>
  )
}
