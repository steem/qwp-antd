import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Popover, Popconfirm } from 'antd'
import { Link } from 'dva/router'
import styles from './Header.less'
import LeftMenu from './LeftMenu'
import UserMenu from './UserMenu'
import Notification from './Notification'
import SystemSwitcher from './SystemSwitcher'
import { classnames, config } from 'utils'
import { l } from 'utils/localization'
import { SiderBarComponentType } from 'enums'
import HeaderNav from './HeaderNav'

const SideMenuSwitcher = React.createClass({
  getInitialState() {
    return {
      visible: true,
    }
  },
  hide() {
    this.setState({
      visible: false,
    })
  },
  handleVisibleChange(visible) {
    this.setState({ visible })
  },
  render() {
    const {
      darkTheme,
      hasSiderBar,
      isNavbar,
      location,
      switchSider,
      siderFold,
    } = this.props
    return (
      isNavbar && this.props.menu ? (<Popover placement="bottomLeft" onVisibleChange={this.handleVisibleChange} visible={this.state.visible} overlayClassName={styles.popovermenu} trigger="click" content={<LeftMenu {...this.props} />}>
        <div className={classnames(styles.button, styles.navItem)}>
          <Icon type="bars" />
        </div>
      </Popover>) : (<div className={classnames(styles.button, styles.navItem)} onClick={switchSider}>
        <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
      </div>)
    )
  },
})

const Header = ({ user, logout, hasSiderBar, locationChangedTag, subSystems, passwordModalProps, notifications, appSettings, switchSider, siderFold, darkTheme, isNavbar, location, siderBarComponentType, menu }) => {
  
  let sideMenuProps
  if (hasSiderBar) {
    sideMenuProps = {
      siderFold,
      darkTheme,
      hasSiderBar,
      isNavbar,
      location,
      hasHeaderNav : appSettings.enableHeaderNav,
      switchSider,
      locationChangedTag,
    }
    if (siderBarComponentType === SiderBarComponentType.MENU) {
      sideMenuProps.menu = menu
    }
  }
  const itemClassName = classnames(styles.button, styles.navItem)
  const sysSwitcherProps = {
    itemClassName,
    subSystems,
  }
  const notiProps = {
    itemClassName,
    notifications,
  }
  const userMenuProps = {
    user,
    logout,
    popoverClassName: classnames(styles.navItem, styles.linkSpace),
    passwordModalProps,
  }
  const headerNavProps = {
    items: appSettings.headerNav,
    locationChangedTag,
  }

  return (
    <div className={classnames(styles.header, "user-menu-popup")}>
      {!hasSiderBar && <img className={styles.logo} title={l('productNameLong')} src={config.logo} />}
      <div className={styles.rightWarpper}>
      {hasSiderBar && <SideMenuSwitcher {...sideMenuProps}/>}
      {subSystems.length > 0 && <SystemSwitcher {...sysSwitcherProps}/>}
      </div>
      <div className={styles.rightWarpper}>
        {appSettings.headerNav.length > 0 && <HeaderNav {...headerNavProps}/> }
        {user.isLogined && <Notification {...notiProps}/>}
        <UserMenu {...userMenuProps}/>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: React.PropTypes.array,
  subSystems: React.PropTypes.array.isRequired,
  appSettings: React.PropTypes.object.isRequired,
  notifications: React.PropTypes.array,
  passwordModalProps: React.PropTypes.object,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  isNavbar: PropTypes.bool,
  hasSiderBar: PropTypes.bool,
  location: PropTypes.object,
}

export default Header
