import request from './request'
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

  set (language, appPath) {
    if (!_LANG[appPath]) _LANG[appPath] = language
    else Object.assign(_LANG[appPath], language)
  },

  async load () {
    return request({
      url: uri.ops({ ops: '_l', mock }),
      method: 'get',
    })
  }

}
