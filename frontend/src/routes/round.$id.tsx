import { useTimer } from '@/hooks/useTimer'
import { useRound } from '@/modules/rounds/queries'
import { createFileRoute } from '@tanstack/react-router'
import {
  differenceInMilliseconds,
  differenceInSeconds,
  isBefore,
  type DateArg,
} from 'date-fns'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const now = useTimer()
  const [roundStatus, setRoundStatus] = useState<
    'pending' | 'cooldown' | 'started' | 'ended'
  >('pending')

  let startTimer = useRef<number>(null)
  let endTimer = useRef<number>(null)

  const timeToStart = useMemo(
    () => (round.data ? formatDifference(round.data.startAt, now) : ''),
    [round.data, now],
  )

  const timeToEnd = useMemo(
    () => (round.data ? formatDifference(round.data.endAt, now) : ''),
    [round.data, now],
  )

  useEffect(() => {
    if (!round.data) return

    setRoundStatus(
      isBefore(now, round.data.startAt)
        ? 'cooldown'
        : isBefore(now, round.data.endAt)
          ? 'started'
          : 'ended',
    )
  }, [round.data])

  useEffect(() => {
    if (!round.data) return

    if (roundStatus === 'cooldown') {
      const msToStart = differenceInMilliseconds(round.data.startAt, new Date())

      if (msToStart > 0) {
        startTimer.current = setTimeout(
          () => setRoundStatus('started'),
          msToStart,
        )
      }

      return () => {
        startTimer.current !== null && clearTimeout(startTimer.current)
      }
    } else if (roundStatus === 'started') {
      const msToEnd = differenceInMilliseconds(round.data.endAt, new Date())

      if (msToEnd > 0) {
        endTimer.current = setTimeout(() => setRoundStatus('ended'), msToEnd)
      }

      return () => {
        endTimer.current !== null && clearTimeout(endTimer.current)
      }
    }
  }, [roundStatus])

  if (round.isLoading) return <div>Loading...</div>
  if (round.error)
    return <div>{(round.error as any)?.message ?? 'Failed to load round'}</div>

  return (
    <div>
      <pre>{JSON.stringify(round.data, null, 2)}</pre>
      <div>{roundStatus}</div>
      <div>
        {roundStatus === 'cooldown' && <div>Time to start: {timeToStart}</div>}
        {roundStatus === 'started' && <div>Time to end: {timeToEnd}</div>}
        {roundStatus === 'ended' && <div>Ended</div>}
      </div>
    </div>
  )
}
