import { TanstackDevtools } from '@tanstack/react-devtools'
import {
  Navigate,
  Outlet,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { Toaster } from '@/components/ui/toaster'
import { useProfile } from '@/modules/auth/queries'
import type { QueryClient } from '@tanstack/react-query'
import styles from './__root.module.css'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const profile = useProfile()
    const location = useLocation()

    return (
      <>
        {!profile.isLoading &&
          (profile.data ? (
            ['/signIn', '/'].includes(location.pathname) && (
              <Navigate to="/rounds" />
            )
          ) : (
            <Navigate to="/signIn" />
          ))}
        <main className={styles.root}>
          <Outlet />
        </main>
        <Toaster />
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      </>
    )
  },
})
