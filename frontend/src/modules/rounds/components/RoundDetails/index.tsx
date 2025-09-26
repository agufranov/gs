import { Panel } from '@/components/Panel'
import { useTimer } from '@/hooks/useTimer'
import { useProfile } from '@/modules/auth/queries'
import type { RoundResponse } from '@backend-types'
import cn from 'classnames'
import { differenceInSeconds, type DateArg } from 'date-fns'
import type React from 'react'
import { useMemo } from 'react'
import { useRoundStatus } from '../../hooks/useRoundStatus'
import { useTap } from '../../queries'
import goose from './goose.png'
import styles from './styles.module.css'

const formatDifference = (endDate: DateArg<Date>, startDate: DateArg<Date>) => {
  const diff = differenceInSeconds(endDate, startDate)
  const seconds = diff % 60
  const minutes = Math.floor(diff / 60)
  return ('' + minutes).padStart(2, '0') + ':' + ('' + seconds).padStart(2, '0')
}

interface RoundProps {
  round: RoundResponse | undefined
}

export const RoundDetails: React.FC<RoundProps> = ({ round }) => {
  if (!round) return null

  const tap = useTap(round.id)
  const profile = useProfile()
  const now = useTimer()
  const roundStatus = useRoundStatus(round)

  const timeToStart = useMemo(
    () => (round ? formatDifference(round.startAt, now) : ''),
    [round, now],
  )

  const timeToEnd = useMemo(
    () => (round ? formatDifference(round.endAt, now) : ''),
    [round, now],
  )

  const roundPlayer = useMemo(() => {
    if (!round) return

    return round.players.find((p) => p.userId === profile.data?.id)
  }, [round])

  return (
    <Panel showProfile title="Раунд">
      <img
        className={cn(styles.goose, {
          [styles.gooseActive]: roundStatus === 'started',
        })}
        src={goose}
        onClick={() => tap.mutateAsync(null)}
      />
      <div>
        {roundStatus === 'cooldown' && (
          <>
            <div>Cooldown</div>
            <div>До начала раунда: {timeToStart}</div>
          </>
        )}
        {roundStatus === 'started' && (
          <>
            <div>Раунд активен!</div>
            <div>До конца осталось: {timeToEnd}</div>
          </>
        )}
        {roundStatus === 'ended' && (
          <>
            <div>Раунд завершён</div>
          </>
        )}
      </div>
    </Panel>
  )
}
