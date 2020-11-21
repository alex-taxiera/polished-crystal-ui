import {
  useState,
  useEffect,
} from 'react'

const DESKTOP_BREAKPOINT = 768

export function useIsMobile () {
  const win = (typeof window !== 'undefined' && window.document)
    ? window : undefined
  const [ width, setWidth ] = useState(win?.innerWidth ?? 1000)
  useEffect(() => {
    const handleResize = () => setWidth(win?.innerWidth ?? 1000)
    win?.addEventListener('resize', handleResize)
    return () => {
      win?.removeEventListener('resize', handleResize)
    }
  }, [ width ])

  return width < DESKTOP_BREAKPOINT
}
