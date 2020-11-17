import React, {
  useEffect,
  useState,
} from 'react'
import { unstable_batchedUpdates as batchUpdate } from 'react-dom'
import {
  useHistory,
  useParams,
} from 'react-router-dom'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'

import {
  BasicLink,
  Link,
} from '../components/link'
import {
  Section,
  SectionContainer,
} from '../components/sections/section'
import { Sprites } from '../components/sprites/sprites'
import {
  usePolishedCrystalService,
} from '../services/pc-api'

import SteelixImg from '../../assets/steelix.png'
import { PokeballSpinner } from '../components/pokeball-spinner/pokeball'

import { Abilities } from '../components/abilities/abilities'
import { MoveTable } from '../components/move-table/move-table'
import { Gender } from '../components/gender/gender'

export default function Pokemon () {
  const params = useParams()
  const id = params.id

  return (
    <>
      <Helmet>
        <title>
          Pokémon
        </title>
      </Helmet>
      <PokemonList id={id} />
      {
        id
          ? (<PokemonStats id={id} />)
          : (
            <Section contentClass="py-4">
              <p className="lead">
                Try selecting a Pokémon from the dropdown!
                <br />
                <Link to="/pokemon/steelix">
                  Steelix perhaps?
                  <br />
                  <br />
                  <img src={SteelixImg} />
                </Link>
              </p>
            </Section>
          )
      }
    </>
  )
}

function pickStat (data, key, faithful = false) {
  const unfaithful = data.unfaithful ?? {}
  return (!faithful && unfaithful[key]) || data[key]
}

function formatStat (data, faithful = false) {
  return {
    ...data,
    types: pickStat(data, 'types', faithful),
    abilities: pickStat(data, 'abilities', faithful),
    evolutions: pickStat(data, 'evolutions', faithful),
    heldItems: pickStat(data, 'heldItems', faithful),
    gender: pickStat(data, 'gender', faithful),
    baseExp: pickStat(data, 'baseExp', faithful),
    catchRate: pickStat(data, 'catchRate', faithful),
    eggGroups: pickStat(data, 'eggGroups', faithful),
    hatchCycles: pickStat(data, 'hatchCycles', faithful),
    growthRate: pickStat(data, 'growthRate', faithful),
    baseStats: pickStat(data, 'baseStats', faithful),
    evYield: pickStat(data, 'evYield', faithful),
    movesByLevel: data.movesByLevel
      .concat((!faithful && data.unfaithful?.movesByLevel) || [])
      .sort((a, b) => a.level - b.level),
    movesByTMHM: data.movesByTMHM
      .concat((!faithful && data.unfaithful?.movesByTMHM) || []),
  }
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
  const pcService = usePolishedCrystalService()
  const [ isLoading, setIsLoading ] = useState(true)
  const [ stat, setStat ] = useState()
  const [ data, setData ] = useState()
  const [ normalSprites, setNormalSprites ] = useState()
  const [ shinySprites, setShinySprites ] = useState()
  const [ faithful, setFaithful ] = useState(false)

  useEffect(() => {
    if (!pcService || !pcService.version) {
      return
    }

    setStat(undefined)
    setNormalSprites(undefined)
    setShinySprites(undefined)
    setData(undefined)
    setIsLoading(true)

    Promise.all([
      pcService.fetchStat(id),
      pcService.getSpriteRoute(id, { shiny: false, scale: 4 }),
      pcService.getSpriteRoute(id, { shiny: true, scale: 4 }),
    ]).then(([ data, normalSprites, shinySprites ]) => {
      batchUpdate(() => {
        setIsLoading(false)
        setStat(data)
        setNormalSprites(normalSprites)
        setShinySprites(shinySprites)
        setData(formatStat(data))
      })
    })
  }, [ id, pcService ])

  useEffect(() => {
    if (stat) {
      setData(formatStat(stat, faithful))
    }
  }, [ faithful ])

  if (isLoading) {
    return (<PokeballSpinner />)
  }

  const sprites = []
  for (let i = 0; i < normalSprites.length; i++) {
    const parts = normalSprites[i].split('_')

    sprites.push({
      name: (normalSprites.length > 1 && parts.length > 1)
        ? parts[parts.length - 1].split('?')[0]
          .replace(/\b(\w)/g, (k) => k.toUpperCase())
        : undefined,
      urls: [ normalSprites[i], shinySprites[i] ],
    })
  }

  return (
    <>
      <Helmet>
        <title>
          {data.displayName}
        </title>
      </Helmet>
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
      <Sprites sprites={sprites} />
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
                  <BasicLink to={`/pokemon/${evo.to.id.toLowerCase()}`}>
                    {evo.to.displayName}
                  </BasicLink>:&nbsp;{evo.type}&nbsp;{evo.requirement}
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
