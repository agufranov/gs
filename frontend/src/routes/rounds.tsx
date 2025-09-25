import { useProfile, useSignOut } from '@/modules/auth/queries'
import {
  useCreateRound,
  useJoinRound,
  useRounds,
} from '@/modules/rounds/queries'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { formatDuration, interval, intervalToDuration } from 'date-fns'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/rounds')({
  component: RoundsRoute,
})

function RoundsRoute() {
  const signOut = useSignOut()
  const profile = useProfile()
  const rounds = useRounds()
  const createRound = useCreateRound()
  const joinRound = useJoinRound()

  const handleCreateRound = () => createRound.mutateAsync(null)

  const handleJoinRound = (id: number) => joinRound.mutateAsync({ id })

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    setInterval(() => setNow(new Date()), 1000)
  }, [])

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
