import { RoundDetails } from '@/modules/rounds/components/RoundDetails'
import { useRound } from '@/modules/rounds/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/round/$id')({
  component: RoundRoute,
})

function RoundRoute() {
  const { id } = Route.useParams()
  const round = useRound(Number(id))

  return <RoundDetails round={round.data} refetch={round.refetch} />
}
