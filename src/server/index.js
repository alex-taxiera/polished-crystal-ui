import { resolve } from 'path'

import helica from 'helica'

import * as config from './utils/config'
import * as reactApp from './controllers/app.js'

const PRODUCTION = config.get('NODE_ENV') === 'production'

const app = new helica.Server({
  debug: !PRODUCTION,
  sslApp: false,
})

// Serve static files
app.serveStatic(resolve(__dirname, '../../dist/public'))
app.serveStatic(resolve(__dirname, '../../dist'), '/dist')

// App and custom redirecting
reactApp.loadRoute(app, '**')

app.run('0.0.0.0', config.get('PORT') ?? 3030)
