import registerModel from 'utils/registerModel'

export default {
  path: 'system/user',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      registerModel(app, require('../../../models/user'))
      cb(null, require('./'))
    }, 'user')
  },
}
