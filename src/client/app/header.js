import React from 'react'
import {
  NavLink,
} from 'react-router-dom'
import cx from 'classnames'

import { VersionSelect } from '../components/api-version-select'
import { MainWidth } from '../components/main-width-container/main-width'

import SuicuneImg from '../../assets/suicune.png'
import styles from './header.module.scss'
import { ThemeToggle } from '../components/theme-toggle/theme-toggle'

export function Header () {
  return (
    <header className={cx('mb-4', styles['page-header'])}>
      <MainWidth>
        <div className="d-flex justify-content-between align-items-center">
          <div className={styles.title}>
            <NavLink className="no-decorate d-flex align-items-center" to="/">
              <img src={SuicuneImg} height={35} />
              <h1 className="ml-3">
                  Polished Crystal Data
              </h1>
            </NavLink>
          </div>
          <div className={styles.nav}>
            <NavLink to="/">
              Home
            </NavLink>
            <NavLink to="/pokemon">
              Pokémon
            </NavLink>
            <ThemeToggle />
          </div>
          <div className={styles['version-selector']}>
            <VersionSelect />
          </div>
        </div>
      </MainWidth>
    </header>
  )
}
