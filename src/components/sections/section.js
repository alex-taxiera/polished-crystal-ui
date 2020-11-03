import React from 'react'
import cx from 'classnames'

import styles from './sections.module.scss'

export function Section ({
  title,
  children,
  contentClass,
}) {
  return (
    <section className={styles.section}>
      { title ? (
        <header>
          <h6>
            {title}
          </h6>
        </header>
      ) : undefined}
      <main className={contentClass}>
        {children}
      </main>
    </section>
  )
}

export function SectionContainer ({ children, vertical = false }) {
  return (
    <div
      className={cx(styles.container, vertical ? styles.vertical : undefined)}
    >
      {children}
    </div>
  )
}
