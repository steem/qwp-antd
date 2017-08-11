import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon } from 'antd'
import styles from './index.less'
import { l } from 'utils/localization'

class Error extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      error,
      icon,
      link,
      linkDesc,
      children,
    } = this.props

    let items
    if (!children) {
      let errIcon = icon ? icon : 'frown-o'
      let desc = error === true ? l('Failed to load site resources') : (error ? error : l('404 Not Found'))
      let solution = link ? (<a href="${link}">${linkDesc}</a>) : (<a href="javascript:window.location.reload()">{l('Refresh')}</a>)
      $items = (<div className={styles.error}>
        <Icon type={errIcon} />
        <h1>{desc}</h1>
        {solution}
      </div>)
    }
    return (
      <div className="content-inner">
        {children || items}
      </div>
    )
  }
}

export default Error
