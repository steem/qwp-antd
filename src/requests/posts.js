import { request, uri } from 'utils'
let mock = true
let baseUri = {
  m: 'posts',
  p: null,
  mock,
}

export async function query (params) {
  let ops = 'get'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}
