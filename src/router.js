import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './ui/app'

function onEnterRouter (nextState, replace, dispatch, namespace, hasSimscroll) {
  dispatch({
    type: 'app/navChanged',
    payload: {
      hasSimscroll: hasSimscroll !== false
    }
  })
  if (namespace) {
    dispatch({
      type: namespace + '/onEnter',
    })
  }
}

function addRouterEnterDispatch(routes, app) {
  for (let r of routes) {
    if (r.childRoutes && r.childRoutes.length > 0) {
      addRouterEnterDispatch(r.childRoutes, app)
    } else {
      let namespace = r.namespace
      r.onEnter = function (nextState, replace) {
        return onEnterRouter(nextState, replace, app._store.dispatch, namespace, r.hasSimscroll)
      }
    }
  }
}

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
  addRouterEnterDispatch(routes, app)
  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
