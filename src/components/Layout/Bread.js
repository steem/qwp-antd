import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'dva/router'
import styles from './Bread.less'
import { l } from 'utils/localization'

const Bread = ({ menu }) => {

  let pathArray = []
  const getPathArray = (path) => {
    let result = []
    path = path.split('/')
    for (let i = 1; i < path.length; ++i) {
      let tmp = []
      for (let j = 0; j <= i; ++j) {
        tmp.push(path[j])
      }
      result.push(tmp.join('/'))
    }
    return result
  }

  pathArray = getPathArray(location.pathname)
  let menuOfPath = []
  for (let item of menu) {
    if (pathArray.includes(item.path)) menuOfPath.push(item)
  }

  const breads = menuOfPath.map(item => {
    const content = (
      <span>{item.icon
          ? <Icon type={item.icon} style={{ marginRight: 4 }} />
          : ''}{l(item.name)}</span>
    )
    return (
      <Breadcrumb.Item key={item.path}>
        {content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread} style={ {display: menuOfPath.length > 0 ? 'block' : 'none'} }>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array.isRequired,
}

export default Bread
