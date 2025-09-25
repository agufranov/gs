import { useProfile, useSignIn } from '@/modules/auth/queries'
import { Button, Card, Field, Fieldset, Input } from '@chakra-ui/react'
import styles from './styles.module.css'

export const SignInForm: React.FC = () => {
  const signIn = useSignIn()
  const profile = useProfile()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    await signIn.mutateAsync({ username, password })
  }

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <Card.Root overflow="hidden">
        <Card.Header
        className={styles.header}
        >
          Войти
        </Card.Header>
        <hr />
        <Card.Body>
          <Fieldset.Root>
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Имя пользователя:</Field.Label>
                <Input className={styles.input} type="text" name="username" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Пароль:</Field.Label>
                <Input
                  className={styles.input}
                  type="password"
                  name="password"
                />
              </Field.Root>
            </Fieldset.Content>
            <Fieldset.ErrorText>{signIn.error}</Fieldset.ErrorText>
          </Fieldset.Root>
          <div className={styles.error}>{signIn.error}</div>
        </Card.Body>
        <Card.Footer flexDirection="column">
          <Button
            type="submit"
            size="md"
            className={styles.button}
            loading={signIn.isPending || profile.isFetching}
          >
            Войти
          </Button>
        </Card.Footer>
      </Card.Root>
    </form>
  )
}
