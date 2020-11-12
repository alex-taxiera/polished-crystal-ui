import React from 'react'
import loadable from '@loadable/component'
import { useIsMobile } from '../../utils/use-is-mobile'

const Desktop = loadable(() => import('./desktop'))
const Mobile = loadable(() => import('./mobile'))

export function MoveTable (props) {
  const isMobile = useIsMobile()

  return (
    <>
      {
        isMobile
          ? (<Mobile {...props} />)
          : (<Desktop {...props} />)
      }
    </>
  )
}
