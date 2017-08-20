import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Icon, Menu, Popover } from 'antd'
import { l } from 'utils/localization'
import styles from './Notification.less'

const Notification = React.createClass({
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
  handleClick(item) {

  },
  render() {
    const {
      itemClassName,
      notifications,
    } = this.props
    let notiMargin = {}
    let notiProps = {}
    if (notifications.length > 0) {
      notiProps.count = notifications.length
      notiMargin.style = {marginRight: 8}
    } else {
      notiProps.dot = true
    }
    const menu = (
      <div className={styles.notification}>
        <div className={styles.notificationTitle}>{l('You have {0} notifications', notifications.length)}</div>
        <div className={styles.notificationList}>
          <Menu onClick={this.handleClick} mode="inline">
            {notifications.map(r => (<Menu.Item key={r.id}>{r.name}</Menu.Item>))}
          </Menu>
        </div>
        <Menu onClick={this.handleClick} mode="inline">
            <Menu.Item key="all">{l('View all')}</Menu.Item>
        </Menu>
      </div>
    )
    return (
      <Popover content={menu} trigger="click" overlayClassName={styles.notificationOverlay} placement="bottomRight" onVisibleChange={this.handleVisibleChange} visible={this.state.visible}>
        <div className={itemClassName} {...notiMargin}>
          <Badge style={{ backgroundColor: '#87d068' }} {...notiProps}>
            <Icon type="notification" className='roate-270'/>
          </Badge>
        </div>
      </Popover>
    )
  }
})

Notification.propTypes = {
  itemClassName: PropTypes.string.isRequired,
  notifications: PropTypes.array.isRequired,
}

export default Notification
