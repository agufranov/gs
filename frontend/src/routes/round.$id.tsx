import { useTimer } from '@/hooks/useTimer'
import { useProfile } from '@/modules/auth/queries'
import { useRoundStatus } from '@/modules/rounds/hooks/useRoundStatus'
import { useRound, useTap } from '@/modules/rounds/queries'
import { createFileRoute } from '@tanstack/react-router'
import { differenceInSeconds, type DateArg } from 'date-fns'
import { useMemo } from 'react'

export const Route = createFileRoute('/round/$id')({
  component: RoundRoute,
})

const formatDifference = (endDate: DateArg<Date>, startDate: DateArg<Date>) => {
  const diff = differenceInSeconds(endDate, startDate)
  const seconds = diff % 60
  const minutes = Math.floor(diff / 60)
  return ('' + minutes).padStart(2, '0') + ':' + ('' + seconds).padStart(2, '0')
}

function RoundRoute() {
  const { id } = Route.useParams()
  const roundId = Number(id)
  const round = useRound(roundId)
  const tap = useTap(Number(id))
  const profile = useProfile()
  const now = useTimer()
  const roundStatus = useRoundStatus(round.data)

  const timeToStart = useMemo(
    () => (round.data ? formatDifference(round.data.startAt, now) : ''),
    [round.data, now],
  )

  const timeToEnd = useMemo(
    () => (round.data ? formatDifference(round.data.endAt, now) : ''),
    [round.data, now],
  )

  const roundPlayer = useMemo(() => {
    if (!round.data) return

    return round.data.players.find((p) => p.userId === profile.data?.id)
  }, [round.data])

  if (round.isLoading) return <div>Loading...</div>
  if (round.error)
    return <div>{(round.error as any)?.message ?? 'Failed to load round'}</div>

  return round.data ? (
    <div>
      <pre>{JSON.stringify(round.data, null, 2)}</pre>
      <div>{roundStatus}</div>
      <div>
        <button onClick={() => tap.mutateAsync(null)}>Tap</button>
      </div>
      <div>Taps: {roundPlayer?.taps}</div>
      <div>Score: {roundPlayer?.score}</div>
      <div>
        {roundStatus === 'cooldown' && <div>Time to start: {timeToStart}</div>}
        {roundStatus === 'started' && <div>Time to end: {timeToEnd}</div>}
        {roundStatus === 'ended' && <div>Ended</div>}
      </div>
    </div>
  ) : null
}
