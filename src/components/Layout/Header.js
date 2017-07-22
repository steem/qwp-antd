import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Popover, Popconfirm } from 'antd'
import { Link } from 'dva/router'
import styles from './Header.less'
import Menus from './Menu'
import UserMenu from './UserMenu'
import Notification from './Notification'
import SystemSwitcher from './SystemSwitcher'
import { classnames } from 'utils'
import { SiderBarComponentType } from 'enums'

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
      navOpenKeys,
      changeOpenKeys,
      switchSider,
      siderFold,
    } = this.props
    return (
      isNavbar && this.props.menu ? (<Popover placement="bottomLeft" onVisibleChange={this.handleVisibleChange} visible={this.state.visible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...this.props} />}>
        <div className={classnames(styles.button, styles.navItem)}>
          <Icon type="bars" />
        </div>
      </Popover>) : (<div className={classnames(styles.button, styles.navItem)} onClick={switchSider}>
        <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
      </div>)
    )
  },
})

const Header = ({ user, logout, showChangePassword, hasSiderBar, notifications, subSystems, switchSider, siderFold, darkTheme, isNavbar, location, navOpenKeys, changeOpenKeys, siderBarComponentType, menu }) => {
  
  let sideMenuProps
  if (hasSiderBar) {
    sideMenuProps = {
      siderFold,
      darkTheme,
      hasSiderBar,
      isNavbar,
      location,
      navOpenKeys,
      changeOpenKeys,
      switchSider,
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
    showChangePassword,
    popoverClassName: classnames(styles.navItem, styles.linkSpace),
  }
  return (
    <div className={classnames(styles.header, "user-menu-popup")}>
      <div className={styles.rightWarpper}>
      {hasSiderBar && <SideMenuSwitcher {...sideMenuProps}/>}
      {subSystems.length > 0 && <SystemSwitcher {...sysSwitcherProps}/>}
      </div>
      <div className={styles.rightWarpper}>
        <Notification {...notiProps}/>
        <UserMenu {...userMenuProps}/>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: React.PropTypes.array,
  subSystems: React.PropTypes.array,
  notifications: React.PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  showChangePassword: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  isNavbar: PropTypes.bool,
  hasSiderBar: PropTypes.bool,
  location: PropTypes.object,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
