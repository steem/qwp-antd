import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Dropdown, Icon } from 'antd'
import { Link } from 'dva/router'

const SystemSwitcher = ({ itemClassName, subSystems }) => {

  const sysMenus = (<Menu>
      <Menu.Item>System Navigation Switcher Menu</Menu.Item>
      <Menu.Divider />
      {subSystems.map(item => (
        <Menu.Item>
          <Link to={item.path}>{item.icon && <Icon type={item.icon} />} {item.name}</Link>
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Dropdown overlay={sysMenus} trigger={['click']}>
      <div className={itemClassName}>
        <a className="ant-dropdown-link">
          <Icon type="down-circle-o" />
        </a>
      </div>
    </Dropdown>
  )
}

SystemSwitcher.propTypes = {
  subSystems: PropTypes.array.isRequired,
  itemClassName: PropTypes.string.isRequired,
}

export default SystemSwitcher
