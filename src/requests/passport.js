import { request, uri } from 'utils'
let m = 'passport'
let p = null
let mock = true

export async function login (params) {
  return request({
    url: uri.ops({ ops: 'login', p, m, mock }),
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: uri.ops({ ops: 'logout', p, m, mock }),
    method: 'get',
    data: params,
  })
}

export async function changePassword (params) {
  return request({
    url: uri.ops({ ops: 'pwd', p, m: 'user', mock }),
    method: 'post',
    data: params,
  })
}

export async function $ (params) {
  return request({
    url: uri.ops({ ops: '$', p, m, mock: false }),
    method: 'get',
    data: params,
  })
}
