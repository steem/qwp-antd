export default {
  path: 'test',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'test')
  },
}
