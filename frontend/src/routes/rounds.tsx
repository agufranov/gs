import { useProfile, useSignOut } from '@/modules/auth/queries'
import { useCreateRound, useRounds } from '@/modules/rounds/queries'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { formatDuration, interval, intervalToDuration } from 'date-fns'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/rounds')({
  component: RoundsRoute,
})

function RoundsRoute() {
  const signOut = useSignOut()
  const profile = useProfile()
  const createRound = useCreateRound()
  const rounds = useRounds()

  const handleCreateRound = () => createRound.mutateAsync(null)

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    setInterval(() => setNow(new Date()), 1000)
  }, [])

  return (
    <div>
      {!profile.data && <Navigate to="/" />}
      <button onClick={() => signOut.mutateAsync()}>
        {profile.data?.username} [Sign out]
      </button>
      {profile.data?.role === 'ADMIN' || true && (
        <button onClick={handleCreateRound}>CreateRound</button>
      )}
      {rounds.data?.map((round) => (
        <div>
          <button>
            {formatDuration(intervalToDuration(interval(now, round.startAt)))}
          </button>
        </div>
      ))}
    </div>
  )
}
