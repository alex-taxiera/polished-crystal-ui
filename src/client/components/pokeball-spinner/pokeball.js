import React from 'react'

import styles from './pokeball.module.scss'

export function PokeballSpinner () {
  return (
    <div className={styles.wrapper}>
      <div className={styles.pokeball}>
        <div className={styles.top} />
        <div className={styles.button}>
          <div />
        </div>
      </div>
    </div>
  )
}
