import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
import uri from 'utils/uri'
import { l } from 'utils/localization'

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
    let current = uri.current().split('/')[1]
    return (
      <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
        {this.props.items.map(item => (<Menu.Item key={item.name}><Link to={item.path}><Icon type={item.icon || 'appstore-o'} />{l(item.name)}</Link></Menu.Item>))}
      </Menu>
    )
  },
})

export default HeaderNav
