import type { RoundResponse } from '@backend-types'
import { Card } from '@chakra-ui/react'
import type React from 'react'

interface RoundProps {
  round: RoundResponse
}

export const Round: React.FC<RoundProps> = ({ round }) => {
  return (
    <Card.Root>
      <Card.Body>{round.startAt}</Card.Body>
    </Card.Root>
  )
}
