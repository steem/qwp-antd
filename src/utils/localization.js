import uri from './uri'
let mock = true
let _LANG = {}

function _l (txt, ...args) {
  if (!args || args.length === 0) {
    return txt
  }
  for (let i = 0, cnt = args.length; i < cnt; ++i) {
    txt = txt.replace(new RegExp(`\\{${i}\\}`, 'gm'), args[i])
  }
  return txt
}

module.exports = {
  l (txt, ...args) {
    let appPath = uri.current().split('/')
    while (appPath.length > 0) {
      let path = appPath.join('/')
      if (!path) path = '/'
      if (_LANG[path]) {
        let l = _LANG[path]
        if (l[txt]) return _l(l[txt], args)
      }
      appPath.pop()
    }
    return txt
  },

  set (language, update) {
    for (let i in language) {
      let l = language[i]
      let appPath = l[0] === '/passport' ? '/' : l[0]
      if (!_LANG[appPath]) _LANG[appPath] = l[1]
      else Object.assign(_LANG[appPath], l[1])
    }
    if (language.length > 0 && update) {
      update({
        type: 'app/updateState',
        payload: {
          localeChangedTag: (new Date()).getTime()
        },
      })
    }
  },

}
