import config from 'config'

export function get (key) {
  return process.env[key] ?? (config.has(key) ? config.get(key) : undefined)
}
