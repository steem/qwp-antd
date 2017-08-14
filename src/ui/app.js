import React from 'react'
import ReactDOM from 'react-dom'
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
import layout from 'utils/layout'
const { prefix } = config
const { Header, Bread, Footer, Sider, styles } = Layout

class AppContainer extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.timerCheckWindow = setInterval(this.checkWindowResize.bind(this), 300)
  }

  componentWillUnmount () {
    if (this.timerCheckWindow) {
      clearInterval(this.timerCheckWindow)
      this.timerCheckWindow = null
    }
  }

  checkWindowResize () {
    let node = ReactDOM.findDOMNode(this.refs.container)
    if (!node) return
    this.resizeState = layout.getResizeState(node, this.resizeState)
    let h = layout.calcFullFillHeight(node)
    let footer = layout.$('#footer')
    let footerHeight = footer.length > 0 ? layout.$(footer).height() : 0
    let content = ReactDOM.findDOMNode(this.refs.content)
    let contentInner = ReactDOM.findDOMNode(this.refs.contentInner)
    if (this.props.app && this.props.app.hasSimscroll) {
      let contentScrollHeight = layout.scrollHeight(contentInner)
      let contentHeight = layout.$(contentInner).height()
      if (this.needUpdateScroll || this.resizeState.needResize || this.contentHeight !== contentHeight || this.contentScrollHeight !== contentScrollHeight) {
        this.contentScrollHeight = contentScrollHeight
        this.contentHeight = contentHeight
        contentInner = layout.$('.content-inner')
        if (this.contentScrollHeight + footerHeight < h) {
          let newHeight = h - footerHeight - layout.getHeightWithoutContent(content) - layout.getHeightWithoutContent(node)
          layout.$(content).height(newHeight)
          if (contentInner.length > 0) {
            contentInner.height(newHeight - layout.getHeightWithoutContent(contentInner))
          }
        } else {
          layout.$(content).height('auto')
          if (contentInner.length > 0) {
            contentInner.height('auto')
          }
        }
      }
      if (!this.resizeState.needResize && !this.needUpdateScroll) return
      this.needUpdateScroll = false
      layout.addSimscroll(node, h, {'suppressScrollX': true})
      this.hasSimscroll = true
    } else if (this.props.app && !this.props.app.hasSimscroll) {
      if (this.resizeState.needResize || this.needUpdateScroll || this.hasSimscroll) {
        contentInner = layout.$('.content-inner')
        let newHeight = h - footerHeight - layout.getHeightWithoutContent(content) - layout.getHeightWithoutContent(node)
        layout.$(content).height(newHeight)
        if (contentInner.length > 0) {
          contentInner.height(newHeight - layout.getHeightWithoutContent(contentInner))
        }
        layout.setHeight(node, h)
      }
      if (this.hasSimscroll) {
        layout.addSimscroll(node, h, {'suppressScrollX': true, 'scrollTop': 0})
        layout.destrySimscroll(node)
        this.hasSimscroll = false
      }
      if (this.needUpdateScroll) this.needUpdateScroll = false
    }
  }

  render () {
    let { 
      children,
      dispatch,
      app,
      loading,
      location
    } = this.props
    const { locationChangedTag, showFooter, localeChangedTag, appSettings, subSystems, hasHeader, notifications, hasBread, hasSiderBar, user, siderFold, darkTheme, isNavbar, siderBarComponentType, menu, siderList } = app
    let { pathname } = location
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
    const { iconFontJS, iconFontCSS, logo } = config
    const hasPermission = menu.filter((item) => item.path === pathname)
    const href = window.location.href

    if (this.lastHref !== href) {
      this.needUpdateScroll = true
      NProgress.start()
      if (!loading.global) {
        NProgress.done()
        this.lastHref = href
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
    let errorProps
    if (app.error) errorProps = { error: app.error }
    if (!hasPermission) errorProps = {
      error: `You don't have the permission, please contact your service administraotr`
    }
    let layoutClassName = classnames(styles.layout, { [styles.noFooter]: !showFooter }, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: !hasSiderBar || isNavbar })
    const isLoading = loading.effects['app/init'] || loading.effects['app/navChanged']
    return (
    <div loc={localeChangedTag}>
      <Helmet>
        <title>{l('productName')}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS}></script>}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      {isLoading ? <Loader spinning={isLoading} /> : <div className={layoutClassName}>
          {hasSiderBar && !isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
            <Sider {...siderProps} />
          </aside> : ''}
          <div className={styles.main}>
            {hasHeader ? <Header {...headerProps} /> : ''}
            {hasBread ? <Bread {...breadProps} /> : ''}
            <div className={styles.container} ref="container" id="container">
              <div className={styles.content} ref="content">
                <div ref="contentInner">
                {errorProps ? <Error {...errorProps} /> : children}
                </div>
              </div>
              {showFooter && <Footer />}
            </div>
          </div>
        </div>
      }
    </div>
    )
  }
}
const App = ({ ...props }) => {
  return (
    <AppContainer {...props}/>
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
