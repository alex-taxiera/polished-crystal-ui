import React from 'react'
import PropTypes from 'prop-types'

import { Section } from '../sections/section'

import styles from './abilities.module.scss'

export function Abilities ({ abilities }) {
  return (
    <Section title="Abilities" withBox="left" contentClass={styles.abilities}>
      <div>1:&nbsp;{abilities.one.name}</div>
      <div>-</div>
      <div>{abilities.one.description}</div>

      <div>2:&nbsp;{abilities.two.name}</div>
      <div>-</div>
      <div>{abilities.two.description}</div>

      <div>H:&nbsp;{abilities.hidden.name}</div>
      <div>-</div>
      <div>{abilities.hidden.description}</div>
    </Section>
  )
}

const AbilityShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
})

Abilities.propTypes = {
  abilities: PropTypes.shape({
    one: AbilityShape,
    two: AbilityShape,
    hidden: AbilityShape,
  }).isRequired,
}
