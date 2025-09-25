import { useEffect, useState } from 'react'

export const useTimer = (delay: number = 1000) => {
  const [now, setNow] = useState(new Date())
  let timer: number | null = null

  useEffect(() => {
    timer = setInterval(() => setNow(new Date()), delay)
    return () => {
      timer !== null && clearInterval(timer)
    }
  })

  return now
}
