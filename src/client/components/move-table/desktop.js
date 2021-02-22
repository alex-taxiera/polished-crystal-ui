import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { MoveShape } from '../../utils/move.shape'

import styles from './desktop.module.scss'

export default function MoveTableDesktop ({ moves, tmhm = false }) {
  return (
    <table className={cx('w-100', styles.moves)}>
      <thead>
        <tr>
          {
            tmhm ? (<th>TM #</th>) : (<th>Level</th>)
          }
          <th colSpan="2">Name</th>
          <th>Type</th>
          <th>Category</th>
          <th>Power</th>
          <th>Accuracy</th>
          <th>PP</th>
          <th>Effect %</th>
        </tr>
      </thead>
      <tbody>
        {
          moves.map((move, i, arr) => (
            <React.Fragment key={i}>
              <tr>
                {
                  tmhm
                    ? (<td>{move.tmhm}</td>)
                    : (
                      <td>
                        {
                          move.evolution
                            ? 'Evolution'
                            : move.level > 1
                              ? move.level
                              : '--'
                        }
                      </td>
                    )
                }
                <td className="text-left" colSpan="2">
                  <span className={styles['move-name']}>
                    {move.name}
                  </span>
                  <br />
                  {move.description}
                </td>
                <td>{move.type}</td>
                <td>{move.category}</td>
                <td>{move.power}</td>
                <td>{move.accuracy}</td>
                <td>{move.pp}</td>
                <td>{move.effectChance}</td>
              </tr>
              {
                (i === arr.length - 1)
                  ? null
                  : (
                    <tr>
                      <td colSpan="9">
                        <hr />
                      </td>
                    </tr>
                  )
              }
            </React.Fragment>
          ))
        }
      </tbody>
    </table>
  )
}

MoveTableDesktop.propTypes = {
  moves: PropTypes.arrayOf(MoveShape).isRequired,
  tmhm: PropTypes.bool,
}
