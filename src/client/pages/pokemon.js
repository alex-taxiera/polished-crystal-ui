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

import { Link } from '../components/link/link'
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

export default function Pokemon () {
  const params = useParams()
  const name = params.name

  return (
    <>
      <Helmet>
        <title>
          {name?.replace(/\b(\w)/g, (k) => k.toUpperCase()) ?? 'Pokémon'}
        </title>
      </Helmet>
      <PokemonList name={name} />
      {
        name
          ? (<PokemonStats name={name} />)
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
  const unfaithful = data.unfaithful ?? {}
  return {
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
      .concat((!faithful && unfaithful.movesByLevel) || [])
      .sort((a, b) => a.level - b.level),
    movesByTMHM: data.movesByTMHM
      .concat((!faithful && unfaithful.movesByTMHM) || []),
  }
}

function StatBlock ({ stats, id }) {
  const list = Object.entries(stats)
  return list
    .concat([ [ 'total', list.reduce((total, [ _, v ]) => total + v, 0) ] ])
    .map(([ label, value ]) => (
      <div key={`${id}-${label}`} className="p-1">
        <div>{label.toUpperCase()}</div>
        <div>{value}</div>
      </div>
    ))
}

function PokemonStats ({ name }) {
  const pcService = usePolishedCrystalService()
  const [ isLoading, setIsLoading ] = useState(true)
  const [ stat, setStat ] = useState()
  const [ data, setData ] = useState()
  const [ normalSprites, setNormalSprits ] = useState()
  const [ shinySprites, setShinySprits ] = useState()
  const [ faithful, setFaithful ] = useState(false)

  useEffect(() => {
    if (!pcService || !pcService.version) {
      return
    }

    setStat(undefined)
    setNormalSprits(undefined)
    setShinySprits(undefined)
    setData(undefined)
    setIsLoading(true)

    Promise.all([
      pcService.fetchStat(name),
      pcService.getSpriteRoute(name, { shiny: false, scale: 4 }),
      pcService.getSpriteRoute(name, { shiny: true, scale: 4 }),
    ]).then(([ data, normalSprites, shinySprites ]) => {
      batchUpdate(() => {
        setIsLoading(false)
        setStat(data)
        setNormalSprits(normalSprites)
        setShinySprits(shinySprites)
        setData(formatStat(data))
      })
    })
  }, [ name, pcService ])

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
      name: normalSprites.length > 1 &&
        parts.length > 1 &&
        parts[parts.length - 1].split('?')[0]
          .replace(/\b(\w)/g, (k) => k.toUpperCase()),
      urls: [ normalSprites[i], shinySprites[i] ],
    })
  }

  return (
    <>
      <div className="d-flex justify-content-between px-2">
        <h3>
          {name.replace(/\b(\w)/g, (k) => k.toUpperCase())}
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
        <Section title="Evolutions">
          {
            data.evolutions.length === 0
              ? <div>None</div>
              : data.evolutions.map((evo, i) => (
                <div key={`evo-${i}`}>
                  {`${evo.to}: ${evo.type} ${evo.requirement}`}
                </div>
              ))
          }
        </Section>
      </SectionContainer>
      <SectionContainer>
        <Section title="Egg Groups" withBox="left">
          {
            data.eggGroups.map((group, i) => (
              <div key={`group-${i}`}>{group}</div>
            ))
          }
        </Section>
        <Section
          title="Gender"
          withBox={!data.gender.genderless ? 'right' : undefined}
        >
          {
            data.gender.genderless ? (
              <>
                Genderless
              </>
            ) : (
              <>
                <div>
                  Male: {data.gender.male}%
                </div>
                <div>
                  Female: {data.gender.female}%
                </div>
              </>
            )
          }
        </Section>
        <SectionContainer vertical={true}>
          <Section title="Growth Rate">
            {data.growthRate}
          </Section>
          <Section title="Hatch Cycles">
            {data.hatchCycles}
          </Section>
        </SectionContainer>
        <SectionContainer vertical={true}>
          <Section title="Base Experience">
            {data.baseExp}
          </Section>
          <Section title="Catch Rate">
            {data.catchRate}
          </Section>
        </SectionContainer>
      </SectionContainer>
      <Section title="Abilities" withBox="left">
        <div className="mb-2">
          1:&nbsp;{data.abilities.one}
        </div>
        <div className="mb-2">
          2:&nbsp;{data.abilities.two}
        </div>
        <div>
          H:&nbsp;{data.abilities.hidden}
        </div>
      </Section>
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
      <SectionContainer>
        <Section title="Level Up Moves" withBox="left">
          {
            data.movesByLevel.map(({ level, move }) => (
              <div key={`level-${level}-move-${move}`}>
                {level}&nbsp;{move}
              </div>
            ))
          }
        </Section>
        <Section title="TM/HM Moves" withBox="left">
          {
            data.movesByTMHM.map((move) => (
              <div key={`tmhm-move-${move}`}>
                {move}
              </div>
            ))
          }
        </Section>
      </SectionContainer>
    </>
  )
}

PokemonStats.propTypes = {
  name: PropTypes.string.isRequired,
}

function PokemonList ({ name = '' }) {
  const pcService = usePolishedCrystalService()

  const [ list, setList ] = useState()
  const history = useHistory()

  useEffect(() => {
    pcService?.fetchStatList()
      .then((list) => setList(
        list?.map((l) => l.replace(/\b(\w)/g, (k) => k.toUpperCase()))),
      )
  }, [ pcService ])

  const optionKey = 'pokemon-option'
  const options = list && list.map((p, i) => (
    <option key={`${optionKey}-${i}`} value={p}>
      {p}
    </option>
  ))

  return (
    <div className="d-flex justify-content-end px-2">
      <select
        value={name.replace(/\b(\w)/g, (k) => k.toUpperCase())}
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
  name: PropTypes.string,
}
