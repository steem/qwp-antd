export default {
  path: 'sample/chart/areaChart',
  getComponent (nextState, cb) {
    let app = this.app
    require.ensure([], require => {
      cb(null, require('./'))
    }, 'chart-areaChart')
  },
}
