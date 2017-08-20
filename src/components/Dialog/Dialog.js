import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import layout from 'utils/layout'
import { l } from 'utils/localization'
import _ from 'lodash'

class AutoSizeDialog extends React.Component {
  componentDidMount () {
    if (this.props.autoSize) {
      if (_.isInteger(this.props.autoSize)) {
        this.setHeight(this.props.autoSize)
      } else {
        // max or maxHeight
        this.isMax = this.props.autoSize === 'max'
        this.timerCheckWindow = setInterval(this.checkWindowResize.bind(this), 200)
      }
    }
  }

  componentWillUnmount () {
    if (this.timerCheckWindow) {
      clearInterval(this.timerCheckWindow)
      this.timerCheckWindow = null
    }
  }

  setHeight (h, node) {
    if (!node) node = this.dialog
    if (node) layout.addSimscroll(node, h)
  }

  checkWindowResize () {
    let node = this.dialog
    if (!node) return
    node = layout.$(node)
    if (!node.is(':visible')) return
    this.resizeState = layout.getResizeState(node, this.resizeState)
    if (!this.resizeState.needResize) return
    let h = layout.$(window).height()
    let parent = node.closest('.ant-modal-content')
    h -= layout.getFullHeight(parent.find('.ant-modal-header'))
    h -= layout.getFullHeight(parent.find('.ant-modal-footer'))
    h -= layout.getHeightWithoutContent(parent.find('.ant-modal-body'))
    h -= 48
    this.setHeight(h, node)
    if (!this.isMax) return
    parent = parent.closest('.ant-modal')
    layout.$(parent).css('width', (layout.$(window).width() - 48) + 'px')
  }

  render () {
    let props = {}
    if (_.isUndefined(this.props.maskClosable)) props.maskClosable = false
    if (_.isUndefined(this.props.okText)) props.okText = l('Ok')
    if (_.isUndefined(this.props.cancelText)) props.cancelText = l('Cancel')
    return (
      <Modal {...this.props} {...props} wrapClassName="vertical-center-modal">
        <div ref={n=>this.dialog=n} style={{ position: 'relative' }}>
          {this.props.children}
        </div>
      </Modal>
    )
  }
}

export default AutoSizeDialog
