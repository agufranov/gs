import { Panel } from '@/components/Panel'
import { useTimer } from '@/hooks/useTimer'
import { useProfile } from '@/modules/auth/queries'
import type { RoundResponse } from '@backend-types'
import cn from 'classnames'
import { differenceInSeconds, type DateArg } from 'date-fns'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
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
  refetch: () => Promise<any>
}

export const RoundDetails: React.FC<RoundProps> = ({ round, refetch }) => {
  if (!round) return null

  const tap = useTap(round.id)
  const profile = useProfile()
  const now = useTimer()
  const roundStatus = useRoundStatus(round)
  const [winner, setWinner] = useState<RoundResponse['players'][number]>()

  const timeToStart = useMemo(
    () => (round ? formatDifference(round.startAt, now) : ''),
    [round, now],
  )

  const timeToEnd = useMemo(
    () => (round ? formatDifference(round.endAt, now) : ''),
    [round, now],
  )

  const currentPlayer = useMemo(() => {
    if (!round) return

    return round.players.find((p) => p.userId === profile.data?.id)
  }, [round])

  useEffect(() => {
    ;(async () => {
      if (roundStatus === 'ended') {
        await refetch()

        // Calculate the winner
        let winnerIndex = 0
        let maxScore = 0
        for (let i in round.players) {
          if (round.players[i].score > maxScore) winnerIndex = Number(i)
        }
        setWinner(round.players[winnerIndex])
      }
    })()
  }, [roundStatus])

  return (
    <Panel
      backButton={{ title: 'Назад', route: '/rounds' }}
      showProfile
      title="Раунд"
    >
      <img
        className={cn(styles.goose, {
          [styles.gooseActive]: roundStatus === 'started',
        })}
        src={goose}
        onClick={() => tap.mutateAsync(null)}
      />
      <hr className={styles.separator} />
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
            <div>Мои очки: {currentPlayer?.score}</div>
          </>
        )}
        {roundStatus === 'ended' && (
          <>
            <div>Раунд завершён</div>
            <div>
              Победитель:{' '}
              {winner && `${winner?.user.username} (${winner?.score})`}
            </div>
            <div>Мои очки: {currentPlayer?.score}</div>
          </>
        )}
      </div>
    </Panel>
  )
}
