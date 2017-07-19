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
      })(require.context('./', true, /^\.\/ui\/((?!\/)[\s\S])+\/route\.js$/)),
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
