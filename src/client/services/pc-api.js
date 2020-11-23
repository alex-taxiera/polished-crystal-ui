import fetch from 'node-fetch'
import { cacheable } from '@datorama/akita'
import {
  createContext,
  useContext,
  useMemo,
} from 'react'
import {
  of,
  from,
} from 'rxjs'
import {
  tap,
} from 'rxjs/operators'

import * as statsStore from '../store/stat/stat.store'
import * as spritesStore from '../store/sprite.store'

import { ConfigContext } from './config'

export const MOVE_SUFFIX = '_M'

export const VersionContext = createContext()
export const PrefetchedContext = createContext()

export function usePolishedCrystalService (config, version) {
  const stores = useContext(PrefetchedContext)
  const configContext = useContext(ConfigContext)
  const versionContext = useContext(VersionContext)

  const baseUrl = config?.pcApiUrl ?? configContext?.pcApiUrl
  const isServer = config?.isServer ?? configContext?.isServer
  const currentVersion = version?.current ?? versionContext?.current

  return useMemo(
    () => {
      if (!baseUrl) {
        return
      }

      return new PolishedCrystalService(
        baseUrl,
        currentVersion,
        isServer ? undefined : stores,
      )
    },
    [ baseUrl, currentVersion, stores ],
  )
}

export class PolishedCrystalService {

  constructor (baseUrl, version, stores = {}) {
    this.baseUrl = baseUrl
    this.version = version

    // cache
    this.moves = {}
    this.statsStore = statsStore.createStore(
      this.version,
      stores[statsStore.storeName],
    )
    this.spritesStore = spritesStore.createStore(
      this.version,
      stores[spritesStore.storeName],
    )
  }

  // TODO: add version store
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
    console.time('backfill')
    const clone = JSON.parse(JSON.stringify(stat))
    const movesToFetch = [
      ...new Set(
        [
          ...clone.movesByLevel,
          ...clone.movesByTMHM,
          ...clone.unfaithful?.movesByLevel ?? [],
          ...clone.unfaithful?.movesByTMHM ?? [],
        ].map((move) => move.id),
      ),
    ]

    const [
      faithFulAbilities,
      moves,
    ] = await Promise.all([
      this.fillAbilityDescriptions(clone.abilities),
      this.getMoves(movesToFetch),
    ])

    const fillMove = (move) => ({
      ...move,
      ...(moves[move.id] ?? moves[`${move.id}${MOVE_SUFFIX}`]),
    })

    clone.abilities = faithFulAbilities
    clone.movesByLevel = clone.movesByLevel.map(fillMove)
    clone.movesByTMHM = clone.movesByTMHM.map(fillMove)
    if (clone.unfaithful) {
      clone.unfaithful.movesByLevel =
        clone.unfaithful.movesByLevel?.map(fillMove)

      clone.unfaithful.movesByTMHM =
        clone.unfaithful.movesByTMHM?.map(fillMove)
    }

    if (clone.unfaithful?.abilities) {
      clone.unfaithful.abilities = await this.fillAbilityDescriptions(
        clone.unfaithful.abilities,
      )
    }
    console.timeEnd('backfill')
    return clone
  }

  fetchStat (pokemon, fullData = true) {
    if (!this.version) {
      return of(undefined)
    }

    const req = from(
      fetch(`${this.baseUrl}/${this.version}/pokemon/stat/${pokemon}`)
        .then((res) => res.json())
        .then(async (stat) => fullData ? this.backFillStat(stat) : stat),
    ).pipe(
      tap((stat) => this.statsStore.data.upsert(stat.id, {
        ...stat,
        complete: fullData,
      })),
    )

    return req
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

  // TODO: add ability store
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

  // TODO: add move akita store
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

  fetchSpriteList () {
    if (!this.version) {
      return of(undefined)
    }

    const req = from(
      fetch(`${this.baseUrl}/${this.version}/pokemon/sprite`)
        .then((res) => res.json()),
    ).pipe(
      tap((list) => this.spritesStore.data.add(list.map((id) => ({ id })))),
    )

    return cacheable(this.spritesStore.data, req)
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

  // TODO: remove this from service
  getSpritesForPokemon (sprites, pokemon) {
    const exact = sprites
      .filter(({ id: sprite }) => sprite === pokemon.toLowerCase())
    const relevantSprites = exact.length > 0
      ? exact
      : sprites.filter(
        ({ id: sprite }) => sprite.startsWith(`${pokemon.toLowerCase()}_`),
      )

    const res = relevantSprites.map(({ id: sprite }) => {
      const nameParts = sprite.split('_')
      const form = nameParts.length < 2
        ? undefined
        : nameParts[nameParts.length - 1]
          .replace(/\b(\w)/g, (k) => k.toUpperCase())

      return {
        form,
        urls: [
          this.formatSpriteRoute(sprite, { shiny: false, scale: 4 }),
          this.formatSpriteRoute(sprite, { shiny: true, scale: 4 }),
        ],
      }
    })

    return res
  }

}
