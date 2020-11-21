import React from 'react'
import {
  NavLink as RouterLink,
} from 'react-router-dom'

import {
  NavLink,
} from '../components/link'
import { VersionSelect } from '../components/api-version-select'

import styles from './header.module.scss'

export function Header () {
  return (
    <header className="m-2 position-relative">
      <div className="d-flex justify-content-center">
        <h1>
          <RouterLink className="no-decorate" to="/">
            Polished Crystal Data
          </RouterLink>
        </h1>
      </div>
      <div className="d-flex justify-content-center">
        <NavLink to="/">
          Home
        </NavLink>
        <NavLink to="/pokemon">
          Pokémon
        </NavLink>
      </div>
      <div className={styles['version-selector']}>
        <VersionSelect />
      </div>
    </header>
  )
}
