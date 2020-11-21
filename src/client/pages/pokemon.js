import React, {
  useContext,
  useEffect,
  useState,
} from 'react'
import { unstable_batchedUpdates as batchUpdate } from 'react-dom'
import {
  NavLink as RouterLink,
  useHistory,
  useParams,
} from 'react-router-dom'
import PropTypes from 'prop-types'

import {
  NavLink,
} from '../components/link'
import {
  Section,
  SectionContainer,
} from '../components/sections/section'
import { Sprites } from '../components/sprites/sprites'
import { PokeballSpinner } from '../components/pokeball-spinner/pokeball'
import { Abilities } from '../components/abilities/abilities'
import { MoveTable } from '../components/move-table/move-table'
import { Gender } from '../components/gender/gender'
import { SEO } from '../components/seo'

import {
  formatStat,
} from '../utils/format-stat'

import {
  PrefetchedContext,
  usePolishedCrystalService,
} from '../services/pc-api'

import SteelixImg from '../../assets/steelix.png'

export default function Pokemon () {
  const params = useParams()
  const id = params.id

  return (
    <>
      <SEO title="Pokémon" />
      <PokemonList id={id} />
      {
        id
          ? (<PokemonStats id={id} />)
          : (
            <Section contentClass="py-4">
              <p className="lead">
                Try selecting a Pokémon from the dropdown!
              </p>
              <p className="lead">
                <NavLink to="/pokemon/steelix">
                  Steelix perhaps?
                </NavLink>
              </p>
              <img src={SteelixImg} />
            </Section>
          )
      }
    </>
  )
}

function StatBlock ({ stats, id }) {
  const list = Object.entries(stats)
  return list
    .concat([ [ 'total', list.reduce((total, [ _, v ]) => total + v, 0) ] ])
    .map(([ label, value ]) => (
      <div key={`${id}-${label}`} className="p-1">
        <h6>{label.toUpperCase()}</h6>
        <div>{value}</div>
      </div>
    ))
}

function PokemonStats ({ id }) {
  const prefetched = useContext(PrefetchedContext)
  const pcService = usePolishedCrystalService()
  const [ isLoading, setIsLoading ] = useState(prefetched == null)
  const [ stat, setStat ] = useState(prefetched?.stat)
  const [ sprites, setSprites ] = useState(prefetched?.sprites)
  const [ faithful, setFaithful ] = useState(false)

  useEffect(() => {
    if (!pcService || !pcService.version || prefetched?.stat?.id === id) {
      return
    }

    setStat(undefined)
    setSprites(undefined)
    setIsLoading(true)

    Promise.all([
      pcService.fetchStat(id),
      pcService.getSpriteNames(id),
    ]).then(([ data, spriteNames ]) => {
      batchUpdate(() => {
        setIsLoading(false)
        setStat(data)
        setSprites(spriteNames)
      })
    })
  }, [ id, pcService ])

  if (isLoading) {
    return (<PokeballSpinner />)
  }

  const data = formatStat(stat)

  const spriteRoutes = sprites.map((sprite) => {
    const nameParts = sprite.split('_')
    const form = nameParts[nameParts.length - 1]
    const name = nameParts.length < 2
      ? undefined
      : form.replace(/\b(\w)/g, (k) => k.toUpperCase())

    return {
      name,
      urls: [
        pcService.formatSpriteRoute(sprite, { shiny: false, scale: 4 }),
        pcService.formatSpriteRoute(sprite, { shiny: true, scale: 4 }),
      ],
    }
  })
  // for (let i = 0; i < sprites.length; i++) {
  //   const parts = sprites[i].split('_')

  //   sprites.push({
  //     name: (normalSprites.length > 1 && parts.length > 1)
  //       ? parts[parts.length - 1].split('?')[0]
  //         .replace(/\b(\w)/g, (k) => k.toUpperCase())
  //       : undefined,
  //     urls: [ normalSprites[i], shinySprites[i] ],
  //   })
  // }

  return (
    <>
      <SEO title={data.displayName} image={spriteRoutes[0].urls[0]} />
      <div className="d-flex justify-content-between px-2">
        <h3>
          {data.displayName}
        </h3>
        <div>
          <label htmlFor="faithful-check">
            Faithful Data
          </label>&nbsp;
          <input
            id="faithful-check"
            type="checkbox"
            disabled={!stat.unfaithful}
            checked={stat.unfaithful ? faithful : true}
            onChange={(event) => setFaithful(event.target.checked)}
          />
        </div>
      </div>
      <Sprites sprites={spriteRoutes} />
      <SectionContainer>
        <Section title="Types" withBox="left">
          {
            data.types.map((type, i) => (
              <div key={`type-${i}`}>
                {type}
              </div>
            ))
          }
        </Section>
        <Section title="Wild Held Items" withBox="left">
          {
            data.heldItems.length === 0
              ? <div>None</div>
              : data.heldItems.map((item, i) => (
                <div key={`items-${i}`}>
                  {item}
                </div>
              ))
          }
        </Section>
        <Section title="Egg Groups" withBox="left">
          {
            data.eggGroups.map((group, i) => (
              <div key={`group-${i}`}>{group}</div>
            ))
          }
        </Section>
        <Gender gender={data.gender} />
        <Section title="Evolutions">
          {
            data.evolutions.length === 0
              ? <div>None</div>
              : data.evolutions.map((evo, i) => (
                <p key={`evo-${i}`} className="m-0">
                  <RouterLink to={`/pokemon/${evo.to.id.toLowerCase()}`}>
                    {evo.to.displayName}
                  </RouterLink>:&nbsp;{evo.type}&nbsp;{evo.requirement}
                </p>
              ))
          }
        </Section>
      </SectionContainer>
      <SectionContainer>
        <SectionContainer>
          <Section title="Growth Rate">
            {data.growthRate}
          </Section>
          <Section title="Hatch Cycles">
            {data.hatchCycles}
          </Section>
        </SectionContainer>
        <SectionContainer>
          <Section title="Base Experience">
            {data.baseExp}
          </Section>
          <Section title="Catch Rate">
            {data.catchRate}
          </Section>
        </SectionContainer>
      </SectionContainer>
      <Abilities abilities={data.abilities} />
      <SectionContainer>
        <Section
          title="Base Stats"
          contentClass="d-flex justify-content-around"
        >
          <StatBlock id="base" stats={data.baseStats} />
        </Section>
        <Section
          title="EV Yield"
          contentClass="d-flex justify-content-around"
        >
          <StatBlock id="ev" stats={data.evYield} />
        </Section>
      </SectionContainer>
      <Section
        title="Level Up Moves"
        contentClass="d-flex justify-content-center"
      >
        <MoveTable moves={data.movesByLevel} />
      </Section>
      <Section
        title="TM/HM Moves"
        contentClass="d-flex justify-content-center"
      >
        <MoveTable moves={data.movesByTMHM} tmhm={true} />
      </Section>
    </>
  )
}

PokemonStats.propTypes = {
  id: PropTypes.string.isRequired,
}

function PokemonList ({ id = '' }) {
  const pcService = usePolishedCrystalService()

  const [ list, setList ] = useState()
  const history = useHistory()

  useEffect(() => {
    pcService?.fetchStatList()
      .then((list) => setList(list.map(({ id, displayName }) => ({
        id: id.toLowerCase(),
        displayName,
      }))))
  }, [ pcService ])

  const options = list && list.map((p, i) => (
    <option key={`pokemon-option-${i}`} value={p.id}>
      {p.displayName}
    </option>
  ))

  return (
    <div className="d-flex justify-content-end px-2">
      <select
        value={id.toLowerCase()}
        onChange={
          (event) => history
            .push(`/pokemon/${event.target.value.toLowerCase()}`)
        }
      >
        <option value="" disabled={true}>
          Select Pokemon
        </option>
        {options}
      </select>
    </div>
  )
}

PokemonList.propTypes = {
  id: PropTypes.string,
}
