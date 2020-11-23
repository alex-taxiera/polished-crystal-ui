import {
  renderRoutes,
} from 'react-router-config'
import loadable from '@loadable/component'
import { PolishedCrystalService } from '../services/pc-api'

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
    prefetch: function ({ id }, { version, url }) {
      if (id) {
        const pcService = new PolishedCrystalService(url, version)
        return Promise.all([
          pcService.fetchStat(id, false).toPromise()
            .then(() => pcService.statsStore.data),
          pcService.fetchSpriteList().toPromise()
            .then(() => pcService.spritesStore.data),
        ])
      }
    },
  },
  {
    component: loadable(() => import('../pages/not-found')),
  },
]

export function Routes () {
  return renderRoutes(config)
}
