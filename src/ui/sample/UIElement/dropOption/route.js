export default {
  path: 'sample/UIElement/dropOption',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'UIElement-dropOption')
  },
}
