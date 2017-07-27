import registerModel from 'utils/registerModel'

export default {
  path: 'sample/post',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      registerModel(app, require('../../../models/post'))
      cb(null, require('./'))
    }, 'post')
  },
}
