export default {
  path: 'sample/UIElement/layer',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'UIElement-layer')
  },
}
