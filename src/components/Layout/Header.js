import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover } from 'antd'
import styles from './Header.less'
import Menus from './Menu'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout, hasNavBar, hasSystemSwitcher, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu }) => {
  let handleClickMenu = e => e.key === 'logout' && logout()
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    hasNavBar: true,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  let preHeader
  if (hasNavBar) {
    preHeader = isNavbar ? (<Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>) : (<div className={styles.button} onClick={switchSider}>
          <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
        </div>)
  } else {
    preHeader = ''
  }
  let systemSwitcher
  if (hasSystemSwitcher) {
    systemSwitcher = (<div className={styles.button}>
        <Icon type="bars" />
      </div>)
  } else {
    systemSwitcher = ''
  }
  return (
    <div className={styles.header}>
      <div className={styles.rightWarpper}>
      {preHeader}
      {systemSwitcher}
      </div>
      <div className={styles.rightWarpper}>
        <div className={styles.button}>
          <Icon type="notification" />
        </div>
        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu style={{
            float: 'right',
          }} title={< span > <Icon type="user" />
            {user.username} < /span>}
          >
            <Menu.Item key="logout">
              Sign out
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  hasNavBar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
