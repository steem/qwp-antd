import React from 'react'
import styles from './avatar.less'
import _ from 'lodash'

class Avatar extends React.Component {
  render() {
    let c1 = _.random(0, 255)
    let c2 = _.random(0, 255)
    let c3 = _.random(0, 255)
    let b1 = 255 - c1
    let b2 = 255 - c2
    let b3 = 255 - c3
    let br1 = parseInt(c1 * 2 / 3)
    let br2 = parseInt(c2 * 2 / 3)
    let br3 = parseInt(c3 * 2 / 3)
    let square = this.props.square || 24
    let props = {
      width: square,
      height: square,
      backgroundColor: `rgb(${b1},${b2},${b3})`,
      color: `rgb(${c1},${c2},${c3})`,
      border: `1px solid rgb(${br1},${br2},${br3})`,
    }
    let textProps = {
      fontSize: this.props.fontSize || '12px',
    }
    return (
      <div className={styles.avatar} style={{ ...props }}>
        <span style={{ ...textProps }} >{this.props.text.toUpperCase()}</span>
      </div>
    )
  }
}

export default Avatar
