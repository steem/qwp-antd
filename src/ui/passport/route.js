import registerModel from 'utils/registerModel'

export default {
  path: 'passport',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      registerModel(app, require('../../models/passport'))
      cb(null, require('./'))
    }, 'passport')
  },
}
