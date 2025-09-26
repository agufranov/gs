import { useLayoutEffect, useState } from 'react'

export const useTimer = (delay: number = 1000) => {
  const [now, setNow] = useState(new Date())
  let timer: ReturnType<typeof setTimeout> | null
  let rafTimer: number | null

  useLayoutEffect(() => {
    const update = () => {
      setNow(new Date())

      timer = setTimeout(
        () => (rafTimer = requestAnimationFrame(update)),
        delay,
      )
    }

    update()

    return () => {
      timer !== null && clearTimeout(timer)
      rafTimer !== null && cancelAnimationFrame(rafTimer)
    }
  }, [])

  return now
}
