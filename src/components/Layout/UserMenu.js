import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Dropdown, Popover, Popconfirm, Button } from 'antd'
import { Link } from 'dva/router'
import styles from './UserMenu.less'
import { classnames } from 'utils'
import userImage from '../../img/user2-160x160.jpg'
import { l } from 'utils/localization'

const UserMenuComponent = React.createClass({
  getInitialState() {
    return {
      visible: false,
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
    let handleSignout = e => this.props.logout()
    let handleChangePassword = e => {
      this.hide()
      this.props.showChangePassword()
    }
    const { user, popoverClassName } = this.props
    const userMenu = (
      <div className={styles.userMenu}>
        <div className={classnames(styles.menuUserImageItem, styles.textAlign)}>
          <img src={userImage} className={classnames(styles.imgCircle, styles.menuUserImage)} alt="User Image" />
          <p className={styles.menuUserImageDesc} style={ {textAlign: 'left', paddingLeft: 12} }>
            User name: {user.username} <br />
            Role: {user.role} <br />
            <small>Create time: {user.createTime}</small>
          </p>
        </div>
        <div className={styles.menuUserOps}>
          <div className={classnames("ant-col-8", styles.textCenter)}>
              <a href="#">Followers</a>
          </div>
          <div className={classnames("ant-col-8", styles.textCenter)}>
              <a href="#">Sales</a>
          </div>
          <div className={classnames("ant-col-8", styles.textCenter)}>
              <a href="#">Friends</a>
          </div>
        </div>
        <div className={styles.menuUserPassport}>
          <div className={classnames("ant-col-12", styles.textCenter)}>
            <Button onClick={handleChangePassword}>{l("Change password")}</Button>
          </div>
          <div className={classnames("ant-col-12", styles.textCenter)}>
            <Popconfirm title={l('Are you sure to sign out?')} placement="left" onConfirm={handleSignout} okText={l("Yes")} cancelText={l("No")}>
              <Button>{l('Sign out')}</Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    )
    return (
      <Popover content={userMenu} trigger="click" placement="bottomRight" overlayClassName="user-menu-popup" onVisibleChange={this.handleVisibleChange} visible={this.state.visible}>
        <div className={popoverClassName}>
            <a className="ant-dropdown-link" href="#">
              <img src={userImage} className={styles.userImage} alt="User Image" />
              <span>{user.username}</span>
            </a>
        </div>
      </Popover>
    )
  },
})

const UserMenu = (props) => {
  return (
    <UserMenuComponent {...props}/>
  )
}

UserMenu.propTypes = {
  showChangePassword: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  popoverClassName: PropTypes.string.isRequired,
}

export default UserMenu
