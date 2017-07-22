import { request, uri } from 'utils'
let m = 'passport'
let p = null
let mock = true

export async function login (params) {
  let ops = 'login'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  let ops = 'logout'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'get',
    data: params,
  })
}

export async function currentUser (params) {
  let ops = 'current'
  let m = 'user'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'get',
    data: params,
  })
}

export async function changePassword (params) {
  let ops = 'pwd'
  let m = 'user'
  return request({
    url: uri.ops({ ops, p, m, mock }),
    method: 'post',
    data: params,
  })
}
