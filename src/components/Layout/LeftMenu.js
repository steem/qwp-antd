import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
import _ from 'lodash'
import layout from 'utils/layout'
import uri from 'utils/uri'
import styles from './Layout.less'

const arrayToTree = (array, children = 'children') => {
  let hash = {}
  let result = []
  for (let item of array) {
    let p = item.path.split('/')
    p.pop()
    p = p.join('/')
    hash[item.path] = item
    if (hash[p]) {
      if (!hash[p][children]) hash[p][children] = []
      if (!hash[p][children].includes(item)) hash[p][children].push(item)
    } else {
      result.push(item)
    }
  }
  return result
}

const getMenus = (menuTreeN, siderFoldN, level) => {
  return menuTreeN.map(item => {
    if (item.children) {
      return (
        <Menu.SubMenu
          key={item.path}
          title={<span>
            {item.icon && <Icon type={item.icon} />}
            {(!siderFoldN || level !== 0) && item.name}
          </span>}
        >
          {getMenus(item.children, siderFoldN, level + 1)}
        </Menu.SubMenu>
      )
    }
    return (
      <Menu.Item key={item.path}>
        <Link to={item.path} title={item.description || item.name}>
          {item.icon && <Icon type={item.icon} />}
          {(!siderFoldN || level !== 0) && item.name}
        </Link>
      </Menu.Item>
    )
  })
}

const getPathArray = (path, hasHeaderNav) => {
  let result = [], i = hasHeaderNav ? 2 : 1
  path = path.split('/')
  for (; i < path.length; ++i) {
    let tmp = []
    for (let j = 0; j <= i; ++j) {
      tmp.push(path[j])
    }
    result.push(tmp.join('/'))
  }
  return result
}

class Menus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openKeys: false
    }
  }
  onOpenChange (openKeys) {
    this.setState({
      openKeys,
    })
  }
  componentDidMount () {
    if (this.props.popMenu) return
    this.onSizeChanged()
    layout.$(window).on('resize', _.debounce(this.onSizeChanged.bind(this), 200))
  }
  componentWillUnmount () {
  }
  onSizeChanged () {
    let node = this.leftMenu
    if (!node) return
    let h = layout.calcFullFillHeight(node, this.props.siderFold ? 2 : 48, true)
    layout.addSimscroll(node, h, {'suppressScrollX': true})
  }
  render () {
    const {
      siderFold,
      hasHeaderNav,
      darkTheme,
      handleClickNavMenu,
      locationChangedTag,
      selectedKeys,
    } = this.props
    let defaultOpenKeys = [...selectedKeys]
    defaultOpenKeys.pop()
    let menuProps = {
      selectedKeys,
      defaultSelectedKeys: selectedKeys,
      locationChangedTag,
    }
    if (!siderFold) {
      menuProps.onOpenChange = this.onOpenChange.bind(this)
      menuProps.openKeys = this.state.openKeys || defaultOpenKeys
    }
    return (
      <div ref={n => this.leftMenu = n} className="qwp-left-menu">
        <Menu
          {...menuProps}
          mode={siderFold ? 'vertical' : 'inline'}
          theme={darkTheme ? 'dark' : 'light'}
          onClick={handleClickNavMenu}
        >
          {this.props.children}
        </Menu>
      </div>
    )
  }
}

const LeftMenu = ({ siderFold, hasHeaderNav, locationChangedTag, darkTheme, handleClickNavMenu, menu }) => {

  let navMenus
  if (hasHeaderNav) {
    navMenus = uri.getAclsByPath(menu)
  } else {
    navMenus = menu
  }
  const menuTree = arrayToTree(navMenus)
  const menuItems = getMenus(menuTree, siderFold, 0)
  let selectedKeys = getPathArray(location.pathname, hasHeaderNav)
  const menuProps = {
    siderFold,
    hasHeaderNav,
    darkTheme,
    handleClickNavMenu,
    locationChangedTag,
    selectedKeys,
  }
  return (
    <Menus {...menuProps}>
      {menuItems}
    </Menus>
  )
}

LeftMenu.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  isSideBarHidden: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  locationChangedTag: PropTypes.number,
  hasHeaderNav: PropTypes.bool,
}

export default LeftMenu
