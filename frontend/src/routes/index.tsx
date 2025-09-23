import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

export const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  console.log(username, password)
}

function App() {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
