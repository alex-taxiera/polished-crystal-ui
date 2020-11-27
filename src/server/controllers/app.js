import {
  resolve,
  join,
} from 'path'
import { promises as fs } from 'fs'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { matchRoutes } from 'react-router-config'
import { HelmetProvider } from 'react-helmet-async'
import { ChunkExtractor } from '@loadable/server'

import fetch from 'node-fetch'
import config from 'config'
import serialize from 'serialize-javascript'
import helica from 'helica'

import { routeLoader } from '../utils/route-loader'

const basePath = resolve(__dirname, '../../../dist/')
const nodePath = join(basePath, 'node')
const webPath = join(basePath, 'web')

const manifestPath = join(nodePath, 'manifest.json')
const nodeStats = join(nodePath, 'loadable-stats.json')
const webStats = join(webPath, 'loadable-stats.json')

class App {

  async get (res, req) {
    const nodeExtractor = new ChunkExtractor({
      statsFile: nodeStats,
      outputPath: nodePath,
    })
    const { App: ReactApp } = nodeExtractor.requireEntrypoint()

    const webExtractor = new ChunkExtractor({
      statsFile: webStats,
      outputPath: webPath,
    })

    const manifest = JSON.parse(await fs.readFile(manifestPath))
    const webConfig = {
      pcApiUrl: config.get('pcApiUrl'),
    }

    const versions = await fetch(
      `${webConfig.pcApiUrl}/polished-crystal/versions`,
    ).then((res) => res.json())
    const data = await Promise.all(
      matchRoutes(ReactApp.routes, req.url).map(
        ({ route, match }) => route.prefetch?.(
          match.params,
          {
            version: versions[0],
            url: config.has('pcApiServerUrl')
              ? config.get('pcApiServerUrl')
              : `http://${config.get('pcApiServerName')}:${config.get('pcApiServerPort')}`,
          },
        ),
      ),
    )

    const preData = {
      manifest,
      config: webConfig,
      versions,
      stores: data.filter((x) => x).flat().reduce((ax, dx) => {
        ax[dx.storeName] = Object.values(dx.getValue().entities)
        return ax
      }, {}),
    }

    const serverData = {
      ...preData,
      config: {
        ...preData.config,
        isServer: true,
      },
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
            search: new URLSearchParams(req.query).toString(),
          }}
        >
          <ReactApp data={serverData} />
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
      Location: '/dist/web/manifest.json',
    })
  }

}

export const loadRoute = routeLoader((app, basePath) => {
  app.addResource('/manifest.webmanifest', Manifest)
  app.addResource(basePath, App)
})
