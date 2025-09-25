import { useEffect } from 'react'

export const useSetTimeout = (fn: () => any, delay: number = 1000) => {
  let timer: number | null = null

  useEffect(() => {
    timer = setTimeout(fn, delay)
    return () => {
      timer !== null && clearTimeout(timer)
    }
  })
}
