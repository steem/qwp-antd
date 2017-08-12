import registerModel from 'utils/registerModel'

let namespace = 'user'

export default {
  path: 'system/user',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      registerModel(app, require('../../../models/user'))
      cb(null, require('./'))
    }, 'user')
  },
  hasSimscroll: false,
  namespace,
}
