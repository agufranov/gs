import type { RoundResponse } from '@backend-types'
import { differenceInMilliseconds, isBefore } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import type { RoundStatus } from '../types'

export const useRoundStatus = (round: RoundResponse | undefined) => {
  const [roundStatus, setRoundStatus] = useState<RoundStatus | null>(null)

  let startTimer = useRef<number>(null)
  let endTimer = useRef<number>(null)

  useEffect(() => {
    if (!round) return

    setRoundStatus(
      isBefore(new Date(), round.startAt)
        ? 'cooldown'
        : isBefore(new Date(), round.endAt)
          ? 'started'
          : 'ended',
    )
  }, [round])

  useEffect(() => {
    if (!round) return

    if (roundStatus === 'cooldown') {
      const msToStart = differenceInMilliseconds(round.startAt, new Date())

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
      const msToEnd = differenceInMilliseconds(round.endAt, new Date())

      if (msToEnd > 0) {
        endTimer.current = setTimeout(() => setRoundStatus('ended'), msToEnd)
      }

      return () => {
        endTimer.current !== null && clearTimeout(endTimer.current)
      }
    }
  }, [roundStatus])

  return roundStatus
}
