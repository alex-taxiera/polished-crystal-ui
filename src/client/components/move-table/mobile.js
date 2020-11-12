import React from 'react'
import PropTypes from 'prop-types'

import { MoveShape } from '../../utils/move.shape'

import styles from './mobile.module.scss'

export default function MoveTableMobile ({ moves, tmhm = false }) {
  return (
    <dl className={styles.wrapper}>
      {
        moves.map((move, i, arr) => (
          <React.Fragment key={i}>
            <dl className={styles.move}>
              <dt>Name</dt>
              <dd>{move.name}</dd>

              {
                tmhm
                  ? (
                    <>
                      <dt>TM #</dt>
                      <dd>{move.tmhm}</dd>
                    </>
                  ) : (
                    <>
                      <dt>Level</dt>
                      <dd>{move.level > 1 ? move.level : '--'}</dd>
                    </>
                  )
              }

              <dt>Description</dt>
              <dd>{move.description}</dd>

              <dt>Type</dt>
              <dd>{move.type}</dd>

              <dt>Category</dt>
              <dd>{move.category}</dd>

              <dt>Power</dt>
              <dd>{move.power}</dd>

              <dt>Accuracy</dt>
              <dd>{move.accuracy}</dd>

              <dt>PP</dt>
              <dd>{move.pp}</dd>

              <dt>Effect Chance</dt>
              <dd>{move.effectChance}</dd>
            </dl>
            {
              (i === arr.length - 1) ? null : (<hr />)
            }
          </React.Fragment>
        ))
      }
    </dl>
  )
}

MoveTableMobile.propTypes = {
  moves: PropTypes.arrayOf(MoveShape).isRequired,
  tmhm: PropTypes.bool,
}
