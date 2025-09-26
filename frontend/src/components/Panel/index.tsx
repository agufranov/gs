import { useProfile, useSignOut } from '@/modules/auth/queries'
import {
  Button,
  Card,
  Menu,
  Portal,
  type CardRootProps,
} from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RiAccountCircleFill, RiArrowLeftLine } from 'react-icons/ri'
import styles from './styles.module.css'

interface PanelProps {
  title?: string
  children?: ReactNode
  cardProps?: CardRootProps
  showProfile?: boolean
  backButton?: {
    title: string
    route: string
  }
}

export const Panel: React.FC<PanelProps> = ({
  title,
  cardProps = {},
  showProfile,
  backButton,
  children,
}) => {
  const profile = useProfile()
  const signOut = useSignOut()
  const router = useRouter()

  return (
    <Card.Root width="100%" overflow="hidden" {...cardProps}>
      <Card.Header className={styles.header}>
        <div>{title}</div>
        {showProfile && (
          <div className={styles.headerAddon}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                  <RiAccountCircleFill />{' '}
                  <span className={styles.username}>
                    {profile.data?.username}
                  </span>
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      color="fg.error"
                      value="signOut"
                      onClick={() => signOut.mutateAsync()}
                    >
                      Выйти
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </div>
        )}
        {backButton && (
          <div className={styles.backButton}>
            <Button
              variant="outline"
              alignItems="center"
              onClick={() => router.navigate({ to: backButton.route })}
            >
              <RiArrowLeftLine /> {backButton.title}
            </Button>
          </div>
        )}
      </Card.Header>
      <hr />
      <Card.Body overflow="hidden">{children}</Card.Body>
    </Card.Root>
  )
}
