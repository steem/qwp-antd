import React from 'react'
import layout from 'utils/layout'
import { Icon } from 'antd'
import styles from './Pager.less'
import { l } from 'utils/localization'

class SimplePager extends React.Component {
  handleBtnClicks (event) {

  }

  render() {
    let title = l('Total items: {total}, current page: {current}', {total: this.props.total || 0, current: this.props.current || 0})
    return (
      <div onClick={this.handleBtnClicks} className={styles.hand} title={title}>
        <a><Icon type="step-forward" className="roate-270" /></a>
        <a><Icon type="caret-up" /></a>
        <a><Icon type="caret-down" /></a>
        <a><Icon type="step-backward" className="roate-270" /></a>
      </div>
    )
  }
}

export default SimplePager
