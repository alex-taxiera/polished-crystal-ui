import { createContext } from 'react'

export const ConfigContext = createContext()

export function loadConfig () {
  const configPath = process.env?.NODE_ENV === 'production'
    ? 'config'
    : 'config.local'

  return fetch(`/config/${configPath}.json`)
    .then((res) => res.json())
}
