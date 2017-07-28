import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Dropdown, Popover, Popconfirm, Button } from 'antd'
import { Link } from 'dva/router'
import styles from './UserMenu.less'
import { classnames } from 'utils'
import userImage from '../../img/user2-160x160.jpg'
import { l } from 'utils/localization'
import ChangePasswordDialog from './ChangePassword'

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
    const { user, popoverClassName, passwordModalProps } = this.props
    const pmProps = {
      navClassName: classnames("ant-col-12", styles.textCenter),
      onShowDialog: () => { this.hide() },
      ...passwordModalProps,
    }
    let userMenu = user.isLogined ? (
      <div className={styles.userMenu}>
        <div className={classnames(styles.menuUserImageItem, styles.textAlign)}>
          <img src={userImage} className={classnames(styles.imgCircle, styles.menuUserImage)} alt="User Image" />
          <p className={styles.menuUserImageDesc} style={ {textAlign: 'left', paddingLeft: 12} }>
            {l("User name")}: {user.username} <br />
            {l("Role")}: {user.roleName} <br />
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
          <ChangePasswordDialog {...pmProps}/>
          <div className={classnames("ant-col-12", styles.textCenter)}>
            <Popconfirm title={l('Are you sure to sign out?')} placement="left" onConfirm={handleSignout} okText={l("Yes")} cancelText={l("No")}>
              <Button>{l('Sign out')}</Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.userMenu}>
        <div className={classnames(styles.menuUserImageItem, styles.textAlign)}>
          <img src={userImage} className={classnames(styles.imgCircle, styles.menuUserImage)} alt="User Image" />
          <p className={styles.menuUserImageDesc} style={ {textAlign: 'center', paddingLeft: 12} }>
            {l("Your are not login")}
          </p>
        </div>
        <div className={styles.menuUserPassport} style={ {textAlign: 'center'} }>
          <Link to="/passport" onClick={this.hide}><Button>{l('Login')}</Button></Link>
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
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  popoverClassName: PropTypes.string.isRequired,
}

export default UserMenu
