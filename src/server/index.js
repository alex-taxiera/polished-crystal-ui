import { resolve } from 'path'

import helica from 'helica'
import config from 'config'

import { dynamicServe } from './utils/dynamic-serve.js'
import * as reactApp from './controllers/app.js'

const PRODUCTION = process.env.NODE_ENV === 'production'

const app = new helica.Server({
  debug: !PRODUCTION,
  sslApp: false,
})

// Serve static files
if (PRODUCTION) {
  app.serveStatic(resolve(__dirname, '../../dist'), '/dist')
} else {
  // for "hot reloading"
  dynamicServe(app, resolve(__dirname, '../../dist'), '/dist')
}
// App and custom redirecting
reactApp.loadRoute(app, '**')

app.run('0.0.0.0', config.has('PORT') ? config.get('PORT') : 3030)
