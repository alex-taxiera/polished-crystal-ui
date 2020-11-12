import {
  useState,
  useEffect,
} from 'react'

const DESKTOP_BREAKPOINT = 768

export function useIsMobile () {
  const [ width, setWidth ] = useState(window?.innerWidth ?? 1000)
  useEffect(() => {
    const handleResize = () => setWidth(window?.innerWidth ?? 1000)
    window?.addEventListener('resize', handleResize)
    return () => {
      window?.removeEventListener('resize', handleResize)
    }
  }, [ width ])

  return width < DESKTOP_BREAKPOINT
}
