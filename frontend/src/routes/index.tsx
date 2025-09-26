import { useProfile } from '@/modules/auth/queries'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const profile = useProfile()

  return (
      <Navigate to="/rounds" />
  )
}
