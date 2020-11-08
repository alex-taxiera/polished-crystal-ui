import helica from 'helica'
import {
  resolve,
  join,
} from 'path'
import { promises as fs } from 'fs'

export function dynamicServe (app, filePath, baseRoute) {
  const fullPath = resolve(filePath)
  const route = baseRoute ?? `/${fullPath.split('/').pop()}`

  app.addResource(`${route}/*`, buildController(fullPath, route))
}

function buildController (folderPath, route) {
  return class {

    async any (res, req) {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        // method not allowed
        return helica.send(res, '', 405, {
          Allow: 'GET, HEAD',
          'Content-Length': '0',
        })
      }
      const fileName = req.url.substring(`${route}/`.length)
      const filePath = join(folderPath, fileName)

      let data
      try {
        data = await fs.readFile(filePath)
      } catch {
        return helica.send(res, `"${fileName}" not found.`, 404)
      }

      helica.send(res, data)
    }

  }
}
