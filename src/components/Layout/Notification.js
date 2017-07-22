import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Icon } from 'antd'

const Notification = ({ itemClassName, notifications }) => {
  
  let notiMargin = {}
  let notiProps = {}
  if (notifications.length > 0) {
    notiProps.count = notifications.length
    notiMargin.style = {marginRight: 8}
  } else {
    notiProps.dot = true
  }

  return (
    <div className={itemClassName} {...notiMargin}>
      <Badge style={{ backgroundColor: '#87d068' }} {...notiProps}>
        <Icon type="notification" className='roate-270'/>
      </Badge>
    </div>
  )
}

Notification.propTypes = {
  itemClassName: PropTypes.string.isRequired,
  notifications: PropTypes.array.isRequired,
}

export default Notification
