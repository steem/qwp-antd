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

function param(name, def) {
  if (typeof(window) === 'undefined') return def
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return def
}

function component(...args) {
  const uri = args.join('/')
  return uri[0] === config.routeUriPrefix ? uri : config.routeUriPrefix + uri
}

function current() {
  return typeof(window) === 'undefined' ? '' : window.location.pathname
}

function ops ({ ops, p, m, mock }) {
  let s = ''
  if (!m) m = param('m')
  if (m) s = join(s, 'm=' + m)
  if (!p) p = param('p')
  if (p) s = join(s, 'p=' + p)
  if (ops) s = join(s, 'op=' + ops)
  return (!mock && !config.useMockSerivce ? config.servicePrefix : config.mockServicePrefix) + s
}

const passportComponent = component('passport')
const isPassportComponent = () => { return current() === passportComponent }

function defaultUri(isLogined, defaultComponent, acls, modulesNeedNotLogin) {
  if (isLogined) {
    if (isPassportComponent()) {
      let from = param('from')
      if (from === '/') from = 0
      return `${location.origin}${from ? from : component(defaultComponent)}`
    }
    if (location.pathname === '/') return component(defaultComponent)
    if (modulesNeedNotLogin.includes(location.pathname.split('/')[1])) {
      return false
    }
    if (acls) {
      for (let i in acls) {
        let item = acls[i]
        if (item.path.indexOf(location.pathname) === -1) continue
        let j = parseInt(i) + 1
        if (j < acls.length) {
          let nextItem = acls[j]
          if (nextItem.path.indexOf(item.path) === 0) {
            continue
          }
        }
        return item.path === location.pathname ? false : item.path
      }
      return component(defaultComponent)
    }
  } else {
    if (isPassportComponent()) return false
    let isRoot = location.pathname === '/'
    let path = isRoot ? component(defaultComponent) : location.pathname
    if (modulesNeedNotLogin.includes(path.split('/')[1])) {
      return isRoot ? path : false
    }
    let from = encodeURI(path) + encodeURI(location.search)
    from = `?from=${from}`
    return `${location.origin}${passportComponent}${from}`
  }
  return false
}

function setDefaultComponent(acls, p, max, path) {
  for (let i = p + 1; i < max; ++i) {
    let item = acls[i]
    if (item.path.indexOf(path) === -1) return
    let j = i + 1
    if (j < max) {
      let nextItem = acls[j]
      if (nextItem.path.indexOf(item.path) === -1) {
        acls[p].path = item.path
        break
      }
    } else {
      acls[p].path = item.path
      break
    }
  }
}

function getHeaderNav (acls, defaultCompnent) {
  let headerNav = [], newAcls = []
  if (acls) {
    const max = acls.length
    let needSelectDefaultComponent = true
    if (defaultCompnent) {
      defaultCompnent = component(defaultCompnent).split('/')
      if (defaultCompnent.length > 2) needSelectDefaultComponent = false
    }
    for (let p in acls) {
      p = parseInt(p)
      let item = acls[p]
      let paths = item.path.split('/')
      if (!item.icon && !item.image) item.icon = 'laptop'
      if (paths.length === 2) {
        setDefaultComponent(acls, p, max, item.path)
        if (needSelectDefaultComponent && (!defaultCompnent || defaultCompnent[1] === paths[1])) {
          defaultCompnent = item.path
          needSelectDefaultComponent = false
        }
        headerNav.push(item)
        let j = p + 1
        if (j < max) {
          let nextItem = acls[j]
          if (nextItem.path.indexOf(item.path) === -1 && item.path.indexOf(nextItem.path) === -1) {
            newAcls.push(item)
          }
        }
      } else {
        newAcls.push(item)
      }
    }
  }
  return { headerNav, defaultNav: defaultCompnent, newAcls }
}

function hasSiderBar (acls) {
  if (!acls || acls.length === 0 || location.pathname === passportComponent) return true
  const path = component(location.pathname.split('/')[1])
  for (let p in acls) {
    let item = acls[p]
    if (item.path === location.pathname) continue
    if (item.path.indexOf(path) === 0) return true
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
  getHeaderNav,
  hasSiderBar,
  getAclsByPath (acls, pathname) {
    if (!pathname) pathname = location.pathname.split('/').slice(0, 2).join('/')
    return acls.filter(_ => _.path.indexOf(pathname) === 0)
  },
}
