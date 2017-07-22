import { request, uri } from 'utils'
let baseUri = {
  m: 'dashboard',
  p: null,
  mock: true
}

export async function myCity (params) {
  return request({
    url: 'http://www.zuimeitianqi.com/zuimei/myCity',
    data: params,
  })
}

export async function queryWeather (params) {
  return request({
    url: 'http://www.zuimeitianqi.com/zuimei/queryWeather',
    data: params,
  })
}

export async function query (params) {
  let ops = 'get'
  return request({
    url: uri.ops({ ops, ...baseUri }),
    method: 'get',
    data: params,
  })
}
