export default {
  path: 'UIElement/dropOption',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'UIElement-dropOption')
  },
}
