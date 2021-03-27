import React, {
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  NavLink,
  useHistory,
  useParams,
} from 'react-router-dom'
import { useObservable } from '@libreact/use-observable'

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
  usePolishedCrystalService,
} from '../services/pc-api'

import SteelixImg from '../../assets/steelix.png'
import { ConfigContext } from '../services/config'
import { Select } from '../components/select/select'
import { Checkbox } from '../components/checkbox/checkbox'

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

export default function Pokemon () {
  const params = useParams()
  const pcService = usePolishedCrystalService()
  pcService.statsStore.data.setActive(params.id ?? null)

  const config = useContext(ConfigContext)
  const [ id ] = useObservable(pcService.statsStore.query.selectActiveId())
  const [ stat ] = useObservable(pcService.statsStore.query.selectActive())
  const [ sprites ] = useObservable(pcService.spritesStore.query.selectAll())
  const [ faithful, setFaithful ] = useState(false)

  const missingData = !stat || !sprites.length
  const needsBackfill = !stat?.complete && !config.isServer

  useEffect(async () => {
    if (!id) {
      return
    }

    if (missingData || needsBackfill) {
      const reqs = []
      if (!stat || needsBackfill) {
        reqs.push(pcService.fetchStat(id).toPromise())
      }

      if (!sprites.length) {
        reqs.push(pcService.fetchSpriteList().toPromise())
      }
      Promise.all(reqs)
    }
  }, [ id ])

  const data = stat ? formatStat(stat, faithful) : undefined
  const spriteRoutes = stat
    ? pcService.getSpritesForPokemon(sprites, stat.id)
    : undefined

  return (
    <>
      <SEO title="Pokémon" />
      <PokemonList
        activeId={id}
        faithful={{
          hidden: !stat,
          setValue: setFaithful,
          checked: faithful || !stat?.unfaithful,
          disabled: !stat?.unfaithful,
        }}
      />
      {
        !id
          ? (<Pizza/>)
          : missingData
            ? (<PokeballSpinner/>)
            : (
              <PokemonStats
                data={data}
                stat={stat}
                spriteRoutes={spriteRoutes}
              />
            )
      }
    </>
  )
}

function NoPokemonSelected () {
  return (
    <div>
      <p className="lead">
        Try selecting a Pokémon from the dropdown!
      </p>
      <p className="lead">
        <NavLink to="/pokemon/steelix">
          Steelix perhaps?
        </NavLink>
      </p>
      <img src={SteelixImg} />
    </div>
  )
}

function PokemonList ({ faithful, activeId }) {
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

  const options = list
    ? list.map((p, i) => (
      <option key={`pokemon-option-${i}`} value={p.id}>
        {p.displayName}
      </option>
    ))
    : activeId
      ? (<option value={activeId}>{activeId}</option>)
      : undefined

  return (
    <div className="d-flex justify-content-between px-2 mb-2">
      <Select
        style={{
          minWidth: 240,
        }}
        className="lead"
        value={activeId?.toLowerCase() ?? ''}
        onChange={
          (event) => history
            .push(`/pokemon/${event.target.value.toLowerCase()}`)
        }
      >
        <option value="" disabled={true}>
          Choose your Pokémon!
        </option>
        {options}
      </Select>
      <div className={faithful.hidden ? 'd-none' : ''}>
        <Checkbox
          id="faithful-check"
          label="Faithful Data"
          disabled={faithful.disabled}
          checked={faithful.checked}
          onChange={(event) => faithful.setValue(event.target.checked)}
        />
      </div>
    </div>
  )
}

function PokemonStats ({
  data, spriteRoutes, stat,
}) {
  return (
    <>
      <SEO title={data.displayName} image={spriteRoutes[0].urls[0]} />
      {/* <div className="d-flex justify-content-between px-2">
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
      </div> */}
      <SectionContainer vertical={true}>
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
                    <NavLink to={`/pokemon/${evo.to.id.toLowerCase()}`}>
                      {evo.to.displayName}
                    </NavLink>:&nbsp;{evo.type}&nbsp;{evo.requirement}
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
        {
          stat.complete
            ? <Abilities abilities={data.abilities} />
            : <PokeballSpinner />
        }
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
        {
          stat.complete
            ? (
              <>
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
            ) : <PokeballSpinner />
        }
      </SectionContainer>
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
      .sort(sortLevelMoves),
    movesByTMHM: data.movesByTMHM
      .concat((!faithful && data.unfaithful?.movesByTMHM) || []),
  }
}

function sortLevelMoves (a, b) {
  const a1 = a.evolution ? 1.5 : a.level
  const b1 = b.evolution ? 1.5 : b.level

  return a1 - b1
}
