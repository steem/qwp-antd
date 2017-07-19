import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './ui/app'

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      childRoutes: (r => {
        return r.keys().map(key => {
          let o = r(key)
          o.app = app
          return o
        })
      })(require.context('./', true, /^\.\/ui\/[\w|\/]+\/route\.js$/)),
    },
  ]
  routes[0].childRoutes.push({
    path: '*',
    getComponent (nextState, cb) {
      require.ensure([], require => {
        cb(null, require('./ui/error/'))
      }, 'error')
    },
  })
  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
