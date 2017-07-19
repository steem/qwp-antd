import { request, uri } from 'utils'
let m = 'user'
let p = null
let mock = true

export async function query (params) {
  let ops = 'get'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'post',
    data: params,
  })
}

export async function create (params) {
  let ops = 'create'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  let ops = 'del'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  let ops = 'edit'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'post',
    data: params,
  })
}
