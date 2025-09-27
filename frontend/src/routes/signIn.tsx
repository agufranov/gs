import { SignInForm } from '@/modules/auth/components/SignInForm'
import { useProfile } from '@/modules/auth/queries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signIn')({
  component: SignInRoute,
})

function SignInRoute() {
  const profile = useProfile()

  return (
    <>
      <SignInForm />
    </>
  )
}
