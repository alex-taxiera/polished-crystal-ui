import React from 'react'
import PropTypes from 'prop-types'

import { Section } from '../sections/section'

import styles from './abilities.module.scss'

export function Abilities ({ abilities }) {
  return (
    <Section title="Abilities" withBox="left" contentClass={styles.abilities}>
      <div>
        <div>
          1:&nbsp;{abilities.one.name}&nbsp;-&nbsp;
        </div>
        <div>{abilities.one.description}</div>
      </div>
      <div>
        <div>
          2:&nbsp;{abilities.two.name}&nbsp;-&nbsp;
        </div>
        <div>{abilities.two.description}</div>
      </div>
      <div>
        <div>
          H:&nbsp;{abilities.hidden.name}&nbsp;-&nbsp;
        </div>
        <div>{abilities.hidden.description}</div>
      </div>
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
