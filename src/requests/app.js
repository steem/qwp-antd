import { request, uri } from 'utils'
let mock = true

export async function $ (m = null, p = null) {
  return request({
    url: uri.ops({ ops: '$', p, m, mock }),
    method: 'get',
  })
}
