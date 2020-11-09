import fetch from 'node-fetch'
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
      .then(async (stat) => {
        stat.abilities = await this.fillAbilityDescriptions(stat.abilities)

        if (stat.unfaithful?.abilities) {
          stat.unfaithful.abilities = await this.fillAbilityDescriptions(
            stat.unfaithful.abilities,
          )
        }

        return stat
      })
  }

  async fillAbilityDescriptions (abilities) {
    const descriptions = await Promise.all(
      Object.entries(abilities).map(async ([ slot, ability ]) => [
        slot,
        (await this.fetchAbility(ability)).description,
      ]),
    )

    const abilitiesWithDescription = {}
    for (const [ slot, description ] of descriptions) {
      abilitiesWithDescription[slot] = `${
        abilities[slot]
      } - ${
        description
      }`
    }

    return abilitiesWithDescription
  }

  async fetchAbilityList () {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/ability`)
      .then((res) => res.json())
  }

  async fetchAbility (ability) {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/ability/${ability}`)
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
