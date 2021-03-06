import React from 'react'

import {
  MainWidth,
} from '../components/main-width-container/main-width'
import {
  Routes,
} from './routes'

import styles from './main.module.scss'

export function Main () {
  return (
    <main id="main-content-area" className={styles['main-area']}>
      <MainWidth>
        <Routes />
      </MainWidth>
    </main>
  )
}
