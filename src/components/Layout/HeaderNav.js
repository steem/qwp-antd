import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover } from 'antd'
import { Link } from 'dva/router'
import uri from 'utils/uri'
import { l } from 'utils/localization'
import styles from './Header.less'
import { classnames } from 'utils'

function createMenu(items, handleClick, mode = 'horizontal') {
  let current = uri.current().split('/')[1]
  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode={mode}>
      {items.map(item => (<Menu.Item key={item.path.split('/')[1]}><Link to={item.path}><Icon type={item.icon || 'appstore-o'} /><span>{l(item.name)}</span></Link></Menu.Item>))}
    </Menu>
  )
}

const HeaderNav = React.createClass({
  getInitialState() {
    return {
      current: uri.current().split('/')[1],
    }
  },
  handleClick(e) {
    this.setState({
      current: e.key,
    })
  },
  render() {
    return (<div>
      <div className={styles.headerNavItems}>
        {createMenu(this.props.items, this.handleClick)}
      </div>
      <Popover content={createMenu(this.props.items, this.handleClick, 'inline')} trigger="click" overlayClassName={styles.headerNavMenus}>
        <div className={classnames(styles.headerNavDropdown, this.props.barClassName)}>
          <Icon type="bars" />
        </div>
      </Popover>
      </div>
    )
  },
})

export default HeaderNav
