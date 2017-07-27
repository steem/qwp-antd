export default {
  path: 'sample/UIElement/dataTable',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'UIElement-dataTable')
  },
}
