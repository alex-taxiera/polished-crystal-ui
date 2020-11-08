import React from 'react'

import {
  Link,
  BasicLink,
} from '../../src/client/components/link/link'
import { VersionSelect } from './components/api-version-select'

import styles from './header.module.scss'

export function Header () {
  return (
    <header className="m-2 position-relative">
      <div className="d-flex justify-content-center">
        <h1>
          <BasicLink to="/">
            Polished Crystal Data
          </BasicLink>
        </h1>
      </div>
      <div className="d-flex justify-content-center">
        <Link to="/">
          Home
        </Link>
        <Link to="/pokemon">
          Pokémon
        </Link>
      </div>
      <div className={styles.versionSelector}>
        <VersionSelect />
      </div>
    </header>
  )
}
