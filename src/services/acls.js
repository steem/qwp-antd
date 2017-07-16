import { request, uri } from 'utils'
let m = 'acls'
let p = null
let mock = true

export async function query (params) {
  let ops = 'get'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'get',
    data: params,
  })
}
