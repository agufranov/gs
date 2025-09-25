import { useRound } from '@/modules/rounds/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/round/$id')({
  component: RoundRoute,
})

function RoundRoute() {
  const { id } = Route.useParams()
  const roundId = Number(id)
  const round = useRound(roundId)

  if (round.isLoading) return <div>Loading...</div>
  if (round.error)
    return <div>{(round.error as any)?.message ?? 'Failed to load round'}</div>

  return (
    <div>
      <pre>{JSON.stringify(round.data, null, 2)}</pre>
    </div>
  )
}
