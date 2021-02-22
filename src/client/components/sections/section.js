import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import styles from './sections.module.scss'
import { ChildrenShape } from '../../utils/children-shape'

export function Section ({
  title,
  children,
  withBox,
  contentClass,
}) {
  const sectionClass = cx(
    styles.section,
  )
  const mainClass = cx(
    contentClass,
    withBox ? 'd-flex justify-content-center' : undefined,
  )

  return (
    <section className={sectionClass}>
      {
        title
          ? (
            <>
              <header>
                <h6>
                  {title}
                </h6>
              </header>
              <hr />
            </>
          ) : undefined
      }
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
  children: ChildrenShape,
  title: PropTypes.string,
  withBox: PropTypes.string,
  contentClass: PropTypes.string,
}

export function SectionContainer ({
  children,
  vertical = false,
}) {
  const className = cx(
    styles.container,
    vertical ? styles.vertical : undefined,
  )

  return (
    <div
      className={className}
    >
      {children}
    </div>
  )
}

SectionContainer.propTypes = {
  children: ChildrenShape,
  vertical: PropTypes.bool,
  gapless: PropTypes.bool,
}
