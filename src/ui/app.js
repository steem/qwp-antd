import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Layout, Loader } from 'components'
import ChangePasswordDialog from 'components/ChangePassword/Modal'
import { classnames, config, uri } from 'utils'
import { Helmet } from 'react-helmet'
import '../themes/index.less'
import './app.less'
import NProgress from 'nprogress'
import Error from './error'
const { prefix } = config
const { Header, Bread, Footer, Sider, styles } = Layout
let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const { error, isLogined, subSystems, showPasswordDialog, hasHeader, notifications, hasBread, hasSiderBar, user, siderFold, darkTheme, isNavbar, navOpenKeys, siderBarComponentType, menu, siderList, permissions } = app
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname))
  const hasPermission = current.length ? permissions.visit.includes(current[0].id) : false
  const href = window.location.href

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = hasHeader ? {
    siderBarComponentType,
    menu,
    user,
    siderFold,
    darkTheme,
    isNavbar,
    hasSiderBar,
    subSystems,
    notifications,
    navOpenKeys,
    showChangePassword() {
      dispatch({ type: 'app/showChangePassword', payload: true })
    },
    logout () {
      dispatch({ type: 'app/logout' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  } : ''

  const siderProps = hasSiderBar ? {
    siderBarComponentType,
    siderList,
    menu,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys (openKeys) {
      localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  } : ''

  const breadProps = hasBread ? {
    menu,
  } : ''

  if (!isLogined || (!hasPermission && uri.isPassportComponent())) {
    return (<div>
      <Loader spinning={loading.effects['app/init']} />
      {children}
    </div>)
  }
  let errorProps = error
  if (!hasPermission) errorProps = {
    error: `You don't have the permission, please contact your service administraotr`
  }
  const passwordModalProps = {
    visible: showPasswordDialog,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.id = user.id
      dispatch({
        type: `app/changePassword`,
        payload: data,
      })
      dispatch({
        type: 'app/showChangePassword',
        payload: false,
      })
    },
    onCancel () {
      dispatch({
        type: 'app/showChangePassword',
        payload: false,
      })
    },
  }
  return (
    <div>
      <Helmet>
        <title>ANTD ADMIN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS}></script>}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: !hasSiderBar || isNavbar })}>
        {hasSiderBar && !isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
          <Sider {...siderProps} />
        </aside> : ''}
        <div className={styles.main}>
          {hasHeader ? <Header {...headerProps} /> : ''}
          {hasBread ? <Bread {...breadProps} /> : ''}
          <div className={styles.container}>
            <div className={styles.content}>
              {hasPermission ? children : <Error {...errorProps}/>}
            </div>
          </div>
          {showPasswordDialog && <ChangePasswordDialog {...passwordModalProps}/>}
          <Footer />
        </div>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ app, loading }) => ({ app, loading }))(App)
