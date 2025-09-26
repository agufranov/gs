import { Panel } from '@/components/Panel'
import { toaster } from '@/components/ui/toaster'
import { useProfile } from '@/modules/auth/queries'
import { Round } from '@/modules/rounds/components/Round'
import {
  useCreateRound,
  useJoinRound,
  useRounds,
} from '@/modules/rounds/queries'
import { Button, Flex, ScrollArea } from '@chakra-ui/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/rounds')({
  component: RoundsRoute,
})

function RoundsRoute() {
  const profile = useProfile()
  const rounds = useRounds()
  const createRound = useCreateRound()
  const joinRound = useJoinRound()
  const navigate = useNavigate()

  const handleJoinRound = async (id: number) => {
    if (joinRound.isPending) {
      console.log('Pending')
      return
    }

    const isParticipating = rounds.data
      ?.find((r) => r.id === id)
      ?.players.find((p) => p.userId === profile.data?.id)

    if (!isParticipating) {
      await joinRound.mutateAsync({ id })
    }

    navigate({ to: '/round/$id', params: { id: String(id) } })
  }

  useEffect(() => {
    if (joinRound.error) {
      toaster.create({
        title: joinRound.error,
        type: 'error',
      })
    }
  }, [joinRound.error])

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
      <ScrollArea.Root>
        <ScrollArea.Viewport
          css={{
            '--scroll-shadow-size': '4rem',
            maskImage:
              'linear-gradient(#000,#000,transparent 0,#000 var(--scroll-shadow-size),#000 calc(100% - var(--scroll-shadow-size)),transparent)',
            '&[data-at-top]': {
              maskImage:
                'linear-gradient(180deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)',
            },
            '&[data-at-bottom]': {
              maskImage:
                'linear-gradient(0deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)',
            },
          }}
        >
          <ScrollArea.Content>
            <Flex flexDirection="column" paddingRight={8} gap={4}>
              {rounds.data?.map((round) => (
                <Round
                  key={round.id}
                  onClick={() => handleJoinRound(round.id)}
                  round={round}
                />
              ))}
            </Flex>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </Panel>
  )
}
