export default {
  path: 'sample/chart/barChart',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'chart-barChart')
  },
}
