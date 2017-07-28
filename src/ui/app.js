import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Layout, Loader } from 'components'
import { classnames, config, uri } from 'utils'
import { Helmet } from 'react-helmet'
import 'themes/index.less'
import './app.less'
import NProgress from 'nprogress'
import Error from './error'
import { l } from 'utils/localization'
const { prefix } = config
const { Header, Bread, Footer, Sider, styles } = Layout
let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const { locationChangedTag, localeChangedTag, appSettings, subSystems, hasHeader, notifications, hasBread, hasSiderBar, user, siderFold, darkTheme, isNavbar, siderBarComponentType, menu, siderList } = app
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const hasPermission = menu.filter((item) => item.path === pathname)
  const href = window.location.href

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }
  const passwordModalProps = {
    maskClosable: false,
    appSettings,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      data.id = user.id
      dispatch({
        type: `app/changePassword`,
        payload: data,
      })
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
    appSettings,
    subSystems,
    notifications,
    passwordModalProps,
    locationChangedTag,
    logout () {
      dispatch({ type: 'app/logout' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
  } : ''

  const siderProps = hasSiderBar ? {
    siderBarComponentType,
    siderList,
    menu,
    locationChangedTag,
    siderFold,
    darkTheme,
    hasHeaderNav : appSettings.enableHeaderNav,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
  } : ''

  const breadProps = hasBread ? {
    menu,
  } : ''
  const showLoadingSpinning = !user.isLogined || (!hasPermission && uri.isPassportComponent())
  let errorProps
  if (app.error) errorProps = app.error
  if (!hasPermission) errorProps = {
    error: `You don't have the permission, please contact your service administraotr`
  }
  return (
    <div loc={localeChangedTag}>
      <Helmet>
        <title>{l('productName')}</title>
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
              { showLoadingSpinning && <Loader spinning={loading.effects['app/init']} /> }
              {hasPermission ? children : <Error {...errorProps}/>}
            </div>
          </div>
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
