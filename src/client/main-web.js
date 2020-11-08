import React from 'react'
import { hydrate } from 'react-dom'
import { loadableReady } from '@loadable/component'

import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import { App } from './app'

// import "global" styles here
import 'bootstrap/dist/css/bootstrap.css'
import './styles/reset.scss'
import './styles/links.scss'

loadableReady(() => hydrate((
  <HelmetProvider>
    <BrowserRouter>
      <App data={window.__SERVER_DATA__} />
    </BrowserRouter>
  </HelmetProvider>
), document.getElementById('root')))
