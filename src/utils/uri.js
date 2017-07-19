const config = require('./config')

function join() {
  let p = '', sep = ''
  for (var i = 0, cnt = arguments.length; i < cnt; ++i) {
    if (arguments[i].length) {
      p += sep + arguments[i]
      sep = '&'
    }
  }
  return p
}

function param(name) {
  if (typeof(window) === 'undefined') return null
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

function component(m) {
  return config.sitePrefix + m
}

function current() {
  if (typeof(window) === 'undefined') return null
  return window.location.pathname
}

function ops ({ ops, p, m, mock }) {
  let s = ''
  if (!m) m = param('m')
  if (m) s = join(s, 'm=' + m)
  if (!p) p = param('p')
  if (p) s = join(s, 'p=' + p)
  s = join(s, 'op=' + ops)
  return (mock === false || !config.useMockSerivce ? config.servicePrefix : config.mockServicePrefix) + s
}

module.exports = {
  blank: 'about:blank',
  param,
  component,
  current,
  ops,
  passportComponent: component('passport'),
  isPassportComponent() { return current() === component('passport') },
}
