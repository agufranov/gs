import type { RoundResponse } from '@backend-types'
import { Card, List } from '@chakra-ui/react'
import { format } from 'date-fns'
import type React from 'react'
import styles from './styles.module.css'

interface RoundProps {
  round: RoundResponse
}

export const Round: React.FC<RoundProps> = ({ round }) => {
  return (
    <Card.Root className={styles.root} cursor="pointer">
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
