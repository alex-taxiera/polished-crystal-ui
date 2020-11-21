import {
  renderRoutes,
} from 'react-router-config'
import loadable from '@loadable/component'

// Pages must use default export for loadable
export const config = [
  {
    path: '/',
    exact: true,
    component: loadable(() => import('../pages/home')),
  },
  {
    path: '/pokemon/:id?',
    component: loadable(() => import('../pages/pokemon')),
    prefetch: function ({ id }, pcService) {
      console.time('fetch')
      return Promise.all([
        pcService.fetchStat(id, false),
        pcService.getSpriteNames(id),
      ]).then(([ data, spriteNames ]) => {
        console.timeEnd('fetch')
        return {
          stat: data,
          sprites: spriteNames,
        }
      })
    },
  },
  {
    component: loadable(() => import('../pages/not-found')),
  },
]

export function Routes () {
  return renderRoutes(config)
}
