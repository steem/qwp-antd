import { request, uri } from 'utils'
let mock = true
let baseUri = {
  m: uri.component('system', 'org'),
  p: null,
  mock,
}

export async function list (params) {
  let ops = 'list'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}

export function uriOfList() {
  let ops = 'list'
  return uri.ops({ ops, ...baseUri})
}

export async function edit (params) {
  let ops = 'edit'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  let ops = 'del'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  let ops = 'create'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}
