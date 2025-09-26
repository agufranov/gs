import { Panel } from '@/components/Panel'
import { useTimer } from '@/hooks/useTimer'
import { useProfile } from '@/modules/auth/queries'
import { Round } from '@/modules/rounds/components/Round'
import {
  useCreateRound,
  useJoinRound,
  useRounds,
} from '@/modules/rounds/queries'
import { Button, Flex } from '@chakra-ui/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/rounds')({
  component: RoundsRoute,
})

function RoundsRoute() {
  const profile = useProfile()
  const rounds = useRounds()
  const createRound = useCreateRound()
  const joinRound = useJoinRound()
  const navigate = useNavigate()

  const handleCreateRound = () => createRound.mutateAsync(null)

  const handleJoinRound = async (id: number) => {
    const isParticipating = rounds.data
      ?.find((r) => r.id === id)
      ?.players.find((p) => p.userId === profile.data?.id)

    if (!isParticipating) {
      await joinRound.mutateAsync({ id })
    }

    navigate({ to: '/round/$id', params: { id: String(id) } })
  }

  const now = useTimer()

  return (
    <Panel showProfile title="Список раундов">
      {profile.data?.role === 'ADMIN' && (
        <Button
          alignSelf="flex-start"
          marginBottom={4}
          loading={createRound.isPending}
          onClick={() => createRound.mutateAsync(null)}
        >
          Создать раунд
        </Button>
      )}
      {rounds.data && !rounds.data?.length && (
        <div style={{ textAlign: 'center' }}>Нет раундов</div>
      )}
      <Flex flexDirection="column" gap={4}>
        {rounds.data?.map((round) => (
          <Round round={round} />
        ))}
      </Flex>
    </Panel>
  )
}
