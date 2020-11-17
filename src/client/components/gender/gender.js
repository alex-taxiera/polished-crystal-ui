import React from 'react'
import PropTypes from 'prop-types'

import { Section } from '../sections/section'

import styles from './gender.module.scss'

export function Gender ({ gender }) {
  return (
    <Section title="Gender" withBox="left">
      {
        gender.genderless ? (
          <>
            Genderless
          </>
        ) : (
          <div className={styles['gender-grid']}>
            <div>Male</div>
            <div>-</div>
            <div>{gender.male}%</div>
            <div>Female</div>
            <div>-</div>
            <div>{gender.female}%</div>
          </div>
        )
      }
    </Section>
  )
}

Gender.propTypes = {
  gender: PropTypes.shape({
    genderless: PropTypes.bool.isRequired,
    male: PropTypes.number,
    female: PropTypes.female,
  }).isRequired,
}
