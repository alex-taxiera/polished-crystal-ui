import React from 'react'

import {
  Section,
} from '../sections/section'

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
          <div key={`spritepair-${i}`} className="mx-2 my-1">
            {
              spriteName
                ? <header><h6>{spriteName}</h6></header>
                : undefined
            }
            <div className="d-flex">
              <img src={normal} />
              <img src={shiny} />
            </div>
          </div>
        ))
      }
    </Section>
  )
}
