import React, {
  useState,
} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import {
  Section,
} from '../sections/section'

import styles from './sprites.module.scss'

const spriteWeight = {
  plain: 0,
  kanto: 1,
  johto: 2,
}

function sortSprites ({ name: a }, { name: b }) {
  return (spriteWeight[a.toLowerCase()] ?? Infinity) -
    (spriteWeight[b.toLowerCase()] ?? Infinity)
}

export function Sprites ({ sprites }) {
  const [ loadedImages, setLoadedImages ] = useState(0)
  const containerClass = cx(
    'mx-2 my-1',
    (loadedImages < sprites.length * 2) ? 'd-none' : undefined,
  )

  return (
    <Section
      title="Sprites"
      contentClass="d-flex justify-content-center flex-wrap"
    >
      {
        sprites.sort(sortSprites).map(({
          name: spriteName,
          urls: [ normal, shiny ],
        }, i) => (
          <div key={`spritepair-${i}`} className={containerClass}>
            {
              spriteName
                ? <header><h6>{spriteName}</h6></header>
                : undefined
            }
            <div className={styles.wrapper}>
              <div>
                <img
                  src={normal}
                  onLoad={() => setLoadedImages(loadedImages + 1)}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              <div>
                <img
                  src={shiny}
                  onLoad={() => setLoadedImages(loadedImages + 1)}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </div>
        ))
      }
    </Section>
  )
}

Sprites.propTypes = {
  sprites: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    urls: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
}
