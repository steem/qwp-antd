export default {
  path: 'sample/UIElement/search',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'UIElement-search')
  },
}
