export default {
  path: 'chart/lineChart',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'chart-lineChart')
  },
}
