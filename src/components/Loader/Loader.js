import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Loader.less'
import { l } from 'utils/localization'

const Loader = ({ spinning }) => {
  return (<div className={classNames(styles.loader, { [styles.hidden]: !spinning })}>
    <div className={styles.warpper}>
      <div className={styles.inner} />
      <div className={styles.text} >{l('LOADING')}</div>
    </div>
  </div>)
}


Loader.propTypes = {
  spinning: PropTypes.bool,
}

export default Loader
