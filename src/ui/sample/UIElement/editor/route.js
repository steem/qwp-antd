export default {
  path: 'sample/UIElement/editor',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'UIElement-editor')
  },
}
