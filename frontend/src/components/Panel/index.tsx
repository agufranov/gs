import { useProfile, useSignOut } from '@/modules/auth/queries'
import {
  Button,
  Card,
  Menu,
  Portal,
  type CardRootProps,
} from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { RiAccountCircleLine } from 'react-icons/ri'
import styles from './styles.module.css'

interface PanelProps {
  title?: string
  children?: ReactNode
  cardProps?: CardRootProps
  showProfile?: boolean
}

export const Panel: React.FC<PanelProps> = ({
  title,
  cardProps = {},
  showProfile,
  children,
}) => {
  const profile = useProfile()
  const signOut = useSignOut()

  return (
    <Card.Root width="100%" overflow="hidden" {...cardProps}>
      <Card.Header className={styles.header}>
        <div>{title}</div>
        {showProfile && (
          <div className={styles.headerAddon}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                  <RiAccountCircleLine /> {profile.data?.username}
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
      </Card.Header>
      <hr />
      <Card.Body overflow="hidden">{children}</Card.Body>
    </Card.Root>
  )
}
