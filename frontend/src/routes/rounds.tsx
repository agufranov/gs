import { useProfile, useSignOut } from '@/modules/auth/queries'
import { useCreateRound, useRounds } from '@/modules/rounds/queries'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/rounds')({
  component: RoundsRoute,
})

function RoundsRoute() {
  const signOut = useSignOut()
  const profile = useProfile()
  const createRound = useCreateRound()
  const rounds = useRounds()

  const handleCreateRound = () => createRound.mutateAsync(null)

  return (
    <div>
      {!profile.data && <Navigate to="/" />}
      <button onClick={() => signOut.mutateAsync()}>
        {profile.data?.username} [Sign out]
      </button>
      {profile.data?.role === 'ADMIN' && (
        <button onClick={handleCreateRound}>CreateRound</button>
      )}
      {rounds.data?.map((round) => (
        <div>
          <button>
            {round.startAt} - {round.endAt}
          </button>
        </div>
      ))}
    </div>
  )
}
