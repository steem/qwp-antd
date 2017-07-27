import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch } from 'antd'
import styles from './Layout.less'
import { config } from 'utils'
import LeftMenu from './LeftMenu'
import { l } from 'utils/localization'

const Sider = ({ siderFold, hasHeaderNav, locationChangedTag, darkTheme, location, changeTheme, menu }) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    hasHeaderNav,
    location,
    locationChangedTag,
  }
  return (
    <div>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        {siderFold ? '' : <span>{l('productName')}</span>}
      </div>
      <LeftMenu {...menusProps} />
      {!siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />Switch Theme</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="Dark" unCheckedChildren="Light" />
      </div> : ''}
    </div>
  )
}

Sider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  locationChangedTag: PropTypes.number,
  hasHeaderNav: PropTypes.bool,
}

export default Sider
