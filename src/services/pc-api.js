import {
  createContext,
  useContext,
  useMemo,
} from 'react'
import { ConfigContext } from './config'

export const VersionContext = createContext()

export function usePolishedCrystalService (config, version) {
  const configContext = useContext(ConfigContext)
  const versionContext = useContext(VersionContext)

  const baseUrl = config?.pcApiUrl ?? configContext?.pcApiUrl
  const currentVersion = version?.current ?? versionContext?.current

  return useMemo(
    () => {
      if (!baseUrl) {
        return
      }

      return new PolishedCrystalService(
        baseUrl,
        currentVersion,
      )
    },
    [ baseUrl, currentVersion ],
  )
}

class PolishedCrystalService {

  constructor (baseUrl, version) {
    this.baseUrl = baseUrl
    this.version = version
  }

  fetchVersions () {
    return fetch(`${this.baseUrl}/polished-crystal/versions`)
      .then(async (res) => res.json())
  }

  async fetchStatList () {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/pokemon/stat`)
      .then((res) => res.json())
  }

  async fetchStat (pokemon) {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/pokemon/stat/${pokemon}`)
      .then((res) => res.json())
  }

  async fetchSpriteList () {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/pokemon/sprite`)
      .then((res) => res.json())
  }

  async getSpriteRoute (pokemon, options = {}) {
    console.log('pokemon :', pokemon)
    if (!this.version) {
      return
    }

    if (!this.validSprites) {
      this.validSprites = this.fetchSpriteList()
    }

    return this.validSprites
      .then((sprites) => sprites
        .filter((sprite) =>
          sprite === pokemon ||
          sprite.startsWith(`${pokemon}_`),
        ))
      .then((relevantSprites) => relevantSprites.map((sprite) => `${
        this.baseUrl
      }/${
        this.version
      }/pokemon/sprite/${
        sprite
      }?shiny=${
        options.shiny
      }&scale=${
        options.scale ?? 1
      }`))
  }

}
