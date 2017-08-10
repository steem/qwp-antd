import { request, uri } from 'utils'
let baseUri = {
  m: uri.component('system', 'user'),
  p: null,
  mock: true
}

export async function query (params) {
  let ops = 'list'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  let ops = 'dels'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}
