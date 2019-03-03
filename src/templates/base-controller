import express, { Request, Response, Router } from 'express'
import { RequestHandler } from 'express-serve-static-core'

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RouterInfo {
  path: string
  method: Methods
  callback: RequestHandler
}

export class BaseController {
  public router = express.Router()
  public basePath = ''
  public routerInfos: RouterInfo[] = []

  static routers(): Router {
    return this.prototype.router
  }
}

export function route(path?: string, method: Methods = 'GET'): MethodDecorator {
  return function(target: BaseController, key: string) {
    if (!path) {
      path = key
    }
    const callback = async function(req: Request, res: Response) {
      res.send(await target[key]({ ...req.params, ...req.query, ...req.body }))
    }

    if (!target.routerInfos) {
      target.routerInfos = []
    }
    target.routerInfos.push({
      method,
      callback,
      path
    })
  }
}

export function get(path?: string) {
  return route(path, 'GET')
}

export function post(path?: string) {
  return route(path, 'POST')
}

export function put(path?: string) {
  return route(path, 'PUT')
}

export function del(path?: string) {
  return route(path, 'DELETE')
}

export function router(basePath: string): ClassDecorator {
  return function(target: typeof BaseController) {
    console.log('class decorator')
    if (!target.prototype.router) {
      target.prototype.router = express.Router()
    }

    const router = target.prototype.router

    target.prototype.routerInfos.forEach(routerInfo => {
      const { method, callback, path } = routerInfo
      switch (method) {
        case 'GET':
          router.get(basePath + path, callback)
          break
        case 'POST':
          router.post(basePath + path, callback)
          break
        case 'PUT':
          router.put(basePath + path, callback)
          break
        case 'DELETE':
          router.delete(basePath + path, callback)
          break
      }
    })
    target.prototype.basePath = basePath
  } as any
}
