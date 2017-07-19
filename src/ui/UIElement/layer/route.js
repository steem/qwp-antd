export default {
  path: 'UIElement/layer',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'UIElement-layer')
  },
}
