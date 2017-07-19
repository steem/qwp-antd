import registerModel from '../../utils/registerModel'

export default {
  path: 'dashboard',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      registerModel(app, require('../../models/dashboard'))
      cb(null, require('./'))
    }, 'dashboard')
  },
}
