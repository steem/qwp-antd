import { request, uri } from 'utils'
let baseUri = {
  m: 'acls',
  p: null,
  mock: true
}

export async function query (params) {
  let ops = 'get'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}
