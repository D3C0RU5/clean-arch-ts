import { HttpRequest, HttpResponse } from './http'

export type Middleware = {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
