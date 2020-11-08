import { resolve } from 'path'
import { promises as fs } from 'fs'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ChunkExtractor } from '@loadable/server'
import queryString from 'query-string'

import serialize from 'serialize-javascript'
import helica from 'helica'
import { routeLoader } from '../utils/route-loader.js'
import { config } from 'process'

const manifestPath = resolve(
  __dirname,
  '../../../public/dist/node/manifest.json',
)

const nodeStats = resolve(
  __dirname,
  '../../../public/dist/node/loadable-stats.json',
)

const webStats = resolve(
  __dirname,
  '../../../public/dist/web/loadable-stats.json',
)

class App {

  async get (res, req) {
    const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
    const { App: ReactApp } = nodeExtractor.requireEntrypoint()

    const webExtractor = new ChunkExtractor({ statsFile: webStats })

    const manifest = JSON.parse(await fs.readFile(manifestPath))
    const webConfig = {
      pcApiUrl: config.get('pcApiUrl'),
    }

    const versions = await fetch(`${webConfig.pcApiUrl}/versions`)
      .then((res) => res.json())

    const preData = {
      manifest,
      config: webConfig,
      versions,
    }
    const context = {
      helmet: {},
      router: {},
    }
    const jsx = webExtractor.collectChunks(
      <HelmetProvider context={context.helmet}>
        <StaticRouter
          context={context.router}
          location={{
            pathname: req.url,
            search: queryString.stringify(req.query),
          }}
        >
          <ReactApp data={preData} />
        </StaticRouter>
      </HelmetProvider>,
    )

    if (context.router.url) {
      return helica.send(res, '', 302, {
        Location: context.router.url,
      })
    }

    const html = renderToString(jsx)
    const { helmet } = context.helmet

    helica.render(res, `
      <!DOCTYPE html>
      <html ${helmet.htmlAttributes.toString()}>
        <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          ${webExtractor.getLinkTags()}
          ${webExtractor.getStyleTags()}
        </head>
        <body ${helmet.bodyAttributes.toString()}>
          <div id="root">${html}</div>
          <script>window.__SERVER_DATA__ = ${serialize(preData)}</script>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
    `)
  }

}

class Manifest {

  get (res) {
    helica.send(res, '', 302, {
      Location: '/dist/web/manifest.webmanifest',
    })
  }

}

class Favicon {

  get (res) {
    helica.send(res, '', 302, {
      Location: '/dist/favicon.ico',
    })
  }

}

export const loadRoute = routeLoader((app, basePath) => {
  app.addResource('/favicon.ico', Favicon)
  app.addResource('/manifest.webmanifest', Manifest)
  app.addResource(basePath, App)
})
