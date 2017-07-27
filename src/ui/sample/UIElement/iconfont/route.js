export default {
  path: 'sample/UIElement/iconfont',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'UIElement-iconfont')
  },
}
