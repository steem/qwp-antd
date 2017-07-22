import { request, uri } from 'utils'
let baseUri = {
  m: 'user',
  p: null,
  mock: true
}

export async function query (params) {
  let ops = 'get'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'post',
    data: params,
  })
}

export async function create (params) {
  let ops = 'create'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  let ops = 'del'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  let ops = 'edit'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'post',
    data: params,
  })
}
