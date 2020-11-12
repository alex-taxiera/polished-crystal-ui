import fetch from 'node-fetch'
import {
  createContext,
  useContext,
  useMemo,
} from 'react'
import { ConfigContext } from './config'

export const MOVE_SUFFIX = '_M'

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

  async fetchStat (pokemon) {
    if (!this.version) {
      return
    }

    return fetch(`${this.baseUrl}/${this.version}/pokemon/stat/${pokemon}`)
      .then((res) => res.json())
      .then(async (stat) => {
        const [
          faithFulAbilities,
          levelMoves,
          tmhmMoves,
        ] = await Promise.all([
          this.fillAbilityDescriptions(stat.abilities),
          this.getMoves(stat.movesByLevel.map((move) => move.id)),
          this.getMoves(stat.movesByTMHM.map((move) => move.id)),
        ])

        stat.abilities = faithFulAbilities
        stat.movesByLevel = stat.movesByLevel.map((move) => ({
          ...move,
          ...(levelMoves[move.id] ?? levelMoves[`${move.id}${MOVE_SUFFIX}`]),
        }))
        stat.movesByTMHM = stat.movesByTMHM.map((move) => ({
          ...move,
          ...(tmhmMoves[move.id] ?? tmhmMoves[`${move.id}${MOVE_SUFFIX}`]),
        }))

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
