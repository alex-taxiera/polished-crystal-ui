import fetch from 'node-fetch'
import {
  createContext,
  useContext,
  useMemo,
} from 'react'
import { ConfigContext } from './config'

export const MOVE_SUFFIX = '_M'

export const VersionContext = createContext()
export const PrefetchedContext = createContext()

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

export class PolishedCrystalService {

  constructor (baseUrl, version) {
    this.baseUrl = baseUrl
    this.version = version

    // cache
    this.moves = {}
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

  async backFillStat (stat) {
    const clone = JSON.parse(JSON.stringify(stat))
    console.time('backfill')
    const [
      faithFulAbilities,
      levelMoves,
      tmhmMoves,
    ] = await Promise.all([
      this.fillAbilityDescriptions(clone.abilities),
      this.getMoves(clone.movesByLevel.map((move) => move.id)),
      this.getMoves(clone.movesByTMHM.map((move) => move.id)),
    ])
    console.timeEnd('backfill')

    clone.abilities = faithFulAbilities
    clone.movesByLevel = clone.movesByLevel.sort((a, b) => {
      const a1 = a.evolution ? 1.5 : a.level
      const b1 = b.evolution ? 1.5 : b.level

      return a1 - b1
    }).map((move) => ({
      ...move,
      ...(levelMoves[move.id] ?? levelMoves[`${move.id}${MOVE_SUFFIX}`]),
    }))
    clone.movesByTMHM = clone.movesByTMHM.map((move) => ({
      ...move,
      ...(tmhmMoves[move.id] ?? tmhmMoves[`${move.id}${MOVE_SUFFIX}`]),
    }))

    if (clone.unfaithful?.abilities) {
      clone.unfaithful.abilities = await this.fillAbilityDescriptions(
        clone.unfaithful.abilities,
      )
    }

    return clone
  }

  async fetchStat (pokemon, fullData = true) {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/pokemon/stat/${pokemon}`)
      .then((res) => res.json())
      .then(async (stat) => fullData ? this.backFillStat(stat) : stat)
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
      abilitiesWithDescription[slot] = {
        name: abilities[slot],
        description: description,
      }
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

  async getMoves (moves) {
    const cached = {}
    const fetches = []
    let fetched

    for (const id of moves) {
      if (this.moves[id]) {
        cached[id] = this.moves[id]
      } else {
        fetches.push(id)
      }
    }

    if (fetches.length > 0) {
      fetched = await this.fetchBulkMoves(fetches)
    }

    return {
      ...cached,
      ...fetched,
    }
  }

  async fetchMoveList () {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/move`)
      .then((res) => res.json())
  }

  async fetchMove (id) {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/move/${id}`)
      .then((res) => res.json())
  }

  async fetchBulkMoves (moves) {
    if (!this.version) {
      return
    }

    const query = `?moves=${moves.join()}`

    return fetch(`${this.baseUrl}/${this.version}/move/bulk${query}`)
      .then((res) => res.json())
      .then((data) => {
        this.moves = {
          ...this.moves,
          ...data,
        }

        return data
      })
  }

  async fetchSpriteList () {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/pokemon/sprite`)
      .then((res) => res.json())
  }

  formatSpriteRoute (spriteName, options = {}) {
    return `${
      this.baseUrl
    }/${
      this.version
    }/pokemon/sprite/${
      spriteName
    }?shiny=${
      options.shiny
    }&scale=${
      options.scale ?? 1
    }`
  }

  async getSpriteNames (pokemon) {
    if (!this.version) {
      return
    }

    if (!this.validSprites) {
      this.validSprites = this.fetchSpriteList()
    }

    return this.validSprites
      .then((sprites) => {
        const exact = sprites
          .filter((sprite) => sprite === pokemon.toLowerCase())

        return exact.length > 0
          ? exact
          : sprites
            .filter((sprite) => sprite.startsWith(`${pokemon.toLowerCase()}_`))
      })
  }

}
