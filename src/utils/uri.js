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

function component(...args) {
  return config.sitePrefix + args.join('/')
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
  if (ops) s = join(s, 'op=' + ops)
  return (mock === false || !config.useMockSerivce ? config.servicePrefix : config.mockServicePrefix) + s
}

const passportComponent = component('passport')
const isPassportComponent = () => { return current() === passportComponent }

function defaultUri(isLogined, defaultComponent) {
  if (isLogined) {
    if (isPassportComponent()) {
      let from = param('from')
      return `${location.origin}${from ? from : component(defaultComponent)}`
    }
    return component(defaultComponent)
  } else {
    if (!isPassportComponent()) {
      let from = location.pathname != '/' || location.search.length ? encodeURI(location.pathname) + encodeURI(location.search) : false
      from = from ? `?from=${from}` : ''
      return `${location.origin}${passportComponent}${from}`
    }
  }
  return false
}

module.exports = {
  blank: 'about:blank',
  param,
  component,
  current,
  ops,
  defaultUri,
  passportComponent,
  isPassportComponent,
}
