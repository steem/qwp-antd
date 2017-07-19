import { request, uri } from 'utils'
let m = 'user'
let p = null
let mock = true

export async function query (params) {
  let ops = 'list'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  let ops = 'dels'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'get',
    data: params,
  })
}
