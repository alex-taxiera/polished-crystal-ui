import React, {
  useEffect,
  useState,
} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import { Home } from './pages/home'
import { Pokemon } from '../../src/client/pages/pokemon'

import {
  AnchorToTab,
  Link,
  BasicLink,
} from '../../src/client/components/link/link'
import { VersionSelect } from './components/api-version-select'
import {
  ConfigContext,
  loadConfig,
} from '../../src/client/services/config'
import {
  usePolishedCrystalService,
  VersionContext,
} from '../../src/client/services/pc-api'

import './app.scss'
import { unstable_batchedUpdates as batchUpdate } from 'react-dom'
import { Helmet } from 'react-helmet'

export function App () {
  const [ config, setConfig ] = useState()
  const [ versions, setVersions ] = useState()
  const [ currentVersion, setCurrentVersion ] = useState()
  const versionData = {
    all: versions,
    current: currentVersion,
    set: (v) => setCurrentVersion(v),
  }
  const pcService = usePolishedCrystalService(config, versionData)

  useEffect(() => {
    if (!config) {
      loadConfig().then((data) => setConfig(data))
    }

    if (config && !versions) {
      pcService?.fetchVersions().then((data) => batchUpdate(() => {
        setVersions(data)
        setCurrentVersion(data[0])
      }))
    }
  })

  return (
    <>
      <Helmet
        defaultTitle="Polished Crystal Data"
        titleTemplate="%s | Polished Crystal Data"
      ></Helmet>
      <ConfigContext.Provider value={config}>
        <VersionContext.Provider value={versionData}>
          <Router>
            <header className="m-2 position-relative">
              <div className="d-flex justify-content-center">
                <h1>
                  <BasicLink to="/">
                    Polished Crystal Data
                  </BasicLink>
                </h1>
              </div>
              <div className="d-flex justify-content-center">
                <Link to="/">
                  Home
                </Link>
                <Link to="/pokemon">
                  Pokémon
                </Link>
              </div>
              <div className="version-selector">
                <VersionSelect />
              </div>
            </header>
            <main className="main-area">
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/pokemon/:name?">
                  <Pokemon />
                </Route>
              </Switch>
            </main>
            <footer className="d-flex justify-content-center m-2">
              <AnchorToTab href="https://github.com/alex-taxiera">
                Alex Taxiera
              </AnchorToTab>
              &nbsp;
              <AnchorToTab href="https://github.com/alex-taxiera/polished-crystal-ui">
                {'<Code />'}
              </AnchorToTab>
            </footer>
          </Router>
        </VersionContext.Provider>
      </ConfigContext.Provider>
    </>
  )
}
