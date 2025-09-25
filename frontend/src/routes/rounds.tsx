import { useTimer } from '@/hooks/useTimer'
import { useProfile, useSignOut } from '@/modules/auth/queries'
import {
  useCreateRound,
  useJoinRound,
  useRounds,
} from '@/modules/rounds/queries'
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { formatDuration, interval, intervalToDuration } from 'date-fns'

export const Route = createFileRoute('/rounds')({
  component: RoundsRoute,
})

function RoundsRoute() {
  const signOut = useSignOut()
  const profile = useProfile()
  const rounds = useRounds()
  const createRound = useCreateRound()
  const joinRound = useJoinRound()
  const navigate = useNavigate()

  const handleCreateRound = () => createRound.mutateAsync(null)

  const handleJoinRound = async (id: number) => {
    await joinRound.mutateAsync({ id })
    navigate({ to: '/round/$id', params: { id: String(id) } })
  }

  const now = useTimer()

  return (
    <div>
      <pre>{JSON.stringify(joinRound.error)}</pre>
      {!profile.data && <Navigate to="/" />}
      <button onClick={() => signOut.mutateAsync()}>
        {profile.data?.username} [Sign out]
      </button>
      {profile.data?.role === 'ADMIN' && (
        <button onClick={handleCreateRound}>CreateRound</button>
      )}
      {rounds.data?.map((round) => (
        <div>
          <button onClick={() => handleJoinRound(round.id)}>
            {formatDuration(intervalToDuration(interval(now, round.startAt)))}
          </button>
        </div>
      ))}
    </div>
  )
}
