import registerModel from '../../utils/registerModel'

export default {
  path: 'user',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      registerModel(app, require('../../models/user'))
      let o = require('./')
      console.log(o)
      cb(null, o)
    }, 'user')
  },
}
