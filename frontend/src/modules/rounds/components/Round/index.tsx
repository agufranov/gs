import type { RoundResponse } from '@backend-types'
import { Card, List, type CardRootProps } from '@chakra-ui/react'
import { format } from 'date-fns'
import type React from 'react'
import styles from './styles.module.css'

interface RoundProps extends CardRootProps {
  round: RoundResponse
}

export const Round: React.FC<RoundProps> = ({ round, ...cardRootProps }) => {
  return (
    <Card.Root className={styles.root} cursor="pointer" {...cardRootProps}>
      <Card.Body>
        <List.Root>
          <List.Item>ID раунда: {round.id}</List.Item>
          <List.Item>Начало: {format(round.startAt, 'HH:mm:ss')}</List.Item>
          <List.Item>Конец: {format(round.endAt, 'HH:mm:ss')}</List.Item>
          <hr className={styles.separator} />
          Статус: Активен
        </List.Root>
      </Card.Body>
    </Card.Root>
  )
}
