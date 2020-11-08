import React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'
import loadable from '@loadable/component'

// Pages must use default export for loadable
const Home = loadable(() => import('../pages/home'))
const Pokemon = loadable(() => import('../pages/pokemon'))
const NotFound = loadable(() => import('../pages/not-found'))

export function Routes () {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/pokemon/:name?">
        <Pokemon />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}
