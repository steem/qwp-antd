import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon } from 'antd'
import styles from './index.less'

const Error = ({ error, icon, link, linkDesc }) => {
  let errIcon = icon ? icon : 'frown-o'
  let desc = error ? error : '404 Not Found'
  let solution = link ? `<a href="${link}">${linkDesc}</a>` : ''
  
  return (
    <div className="content-inner">
      <div className={styles.error}>
        <Icon type={errIcon} />
        <h1>{desc}</h1>
        {solution}
      </div>
  </div>
  )
}

Error.propTypes = {
  error: PropTypes.string,
  icon: PropTypes.string,
  link: PropTypes.string,
  linkDesc: PropTypes.string,
}

export default connect(({ error, icon, link, linkDesc }) => ({ error, icon, link }))(Error)

