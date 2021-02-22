import React, {
  useRef,
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

function sortSprites ({ form: a }, { form: b }) {
  return (spriteWeight[a.toLowerCase()] ?? Infinity) -
    (spriteWeight[b.toLowerCase()] ?? Infinity)
}

export function Sprites ({ sprites }) {
  const refs = sprites.map(() => [ useRef(), useRef() ])
  const loadedImages = sprites.map(() => [ useState(false), useState(false) ])
  const isLoaded = refs.flat().every((ref) => ref.current?.complete) ||
    loadedImages.flat().every(([ loaded ]) => loaded)
  const containerClass = cx('mx-2 my-1', !isLoaded ? 'd-none' : undefined)

  return (
    <Section
      title="Sprites"
      contentClass="d-flex justify-content-center flex-wrap"
    >
      {
        sprites.sort(sortSprites).map(({
          form,
          urls: [ normal, shiny ],
        }, i) => (
          <div key={`spritepair-${i}`} className={containerClass}>
            {
              form && sprites.length > 1
                ? <header><h6>{form}</h6></header>
                : undefined
            }
            <div className={styles.wrapper}>
              <div>
                <img
                  ref={refs[i][0]}
                  src={normal}
                  onLoad={() => loadedImages[i][0][1](true)}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
              <div>
                <img
                  ref={refs[i][1]}
                  src={shiny}
                  onLoad={() => loadedImages[i][1][1](true)}
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
    form: PropTypes.string,
    urls: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
}
