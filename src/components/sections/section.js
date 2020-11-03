import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import styles from './sections.module.scss'

export function Section ({
  title,
  children,
  withBox,
  contentClass,
}) {
  const mainClass = cx(
    contentClass,
    withBox ? 'd-flex justify-content-center' : undefined,
  )

  return (
    <section className={styles.section}>
      { title ? (
        <header>
          <h6>
            {title}
          </h6>
        </header>
      ) : undefined}
      <main className={mainClass}>
        {
          withBox
            ? (
              <div className={`text-${withBox}`}>
                {children}
              </div>
            ) : children
        }
      </main>
    </section>
  )
}

Section.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  title: PropTypes.string,
  withBox: PropTypes.string,
  contentClass: PropTypes.string,
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

SectionContainer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  vertical: PropTypes.bool,
}
