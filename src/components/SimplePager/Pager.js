import React from 'react'
import ReactDOM from 'react-dom'
import layout from 'utils/layout'
import { Icon, Input, InputNumber } from 'antd'
import styles from './Pager.less'
import { classnames } from 'utils'
import { l } from 'utils/localization'
import { message } from 'antd'

class SimplePager extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expand: false,
      pageSize: this.props.pageSize,
    }
  }
  componentDidMount () {
    let node = ReactDOM.findDOMNode(this.refs.pageSize)
    if (node) {
      node = layout.$(node).attr('title', l('Record count per page'))
    }
  }
  handleBtnClicks (event) {
    if (!this.props.onSwitchPage) return
    let node = layout.$(event.target).closest('a')
    let op = node.data('ops')
    if (!op) return
    if (op === 'first') {
      this.props.onSwitchPage(1, this.state.pageSize)
    } else if (op === 'next') {
      if (this.props.current + 1 > this.props.totalPage) {
        message.info(l('This is last page, click refresh button if you want to reload data'))
        return
      }
      this.props.onSwitchPage(this.props.current + 1, this.state.pageSize)
    } else if (op === 'previous') {
      if (this.props.current - 1 <= 0) {
        message.info(l('This is first page, click refresh button if you want to reload data'))
        return
      }
      this.props.onSwitchPage(this.props.current - 1, this.state.pageSize)
    } else if (op === 'last') {
      this.props.onSwitchPage(this.props.totalPage, this.state.pageSize)
    }
  }
  clickNumber () {
    this.setState({
      expand: true,
    })
    let node = ReactDOM.findDOMNode(this.refs.simplePager)
    if (node) {
      node = layout.$(node).closest('.qwp-list-pager')
      node.css({width: '55px', right: '-42px'})
    }
  }
  switchPage (e) {
    let p = parseInt(e.target.value)
    if (!p || p === NaN || p > this.props.totalPage) {
      message.error(l('Wrong page number: {0}, must not be bigger than {1}', p, this.props.totalPage))
      return
    }
    if (this.props.onSwitchPage) this.props.onSwitchPage(p, this.state.pageSize)
  }
  refresh () {
    if (this.props.onSwitchPage) this.props.onSwitchPage(this.props.current, this.state.pageSize)
  }
  onLeave () {
    this.setState({
      expand: false,
    })
    let node = ReactDOM.findDOMNode(this.refs.simplePager)
    if (node) {
      node = layout.$(node).closest('.qwp-list-pager')
      node.css({width: '22px', right: '-9px'})
    }
  }
  handlePageSize (value) {
    this.setState({
      ...this.state,
      pageSize: parseInt(value),
    })
  }
  render() {
    let title = l('Total items: {total}, current page: {current}, total page: {totalPage}', {total: this.props.total || 0, current: this.props.current || 0, totalPage: this.props.totalPage})
    let pageText = l('Page')
    return (
      <div ref="simplePager" onMouseLeave={this.onLeave.bind(this)} onClick={this.handleBtnClicks.bind(this)} className={classnames(styles.hand, {[styles.expand]: this.state.expand})}>
        <span title={title}><Icon type="info-circle-o" /></span><br />
        <a data-ops="first" title={l('First page')}><Icon type="step-forward" className="roate-270" /></a><br />
        <a data-ops="previous" title={l('Previous page')}><Icon type="caret-up" /></a><br />
        <a title={l('Reload current page')} onClick={this.refresh.bind(this)}><Icon type="reload" /></a><br />
        <a data-ops="next" title={l('Next page')}><Icon type="caret-down" /></a><br />
        <a data-ops="last" title={l('Last page')}><Icon type="step-backward" className="roate-270" /></a><br />
        <a title={l('Goto page')} className={styles.switchPage} onClick={this.clickNumber.bind(this)}><Icon type="edit" /></a>
        <div className={styles.pageSetting}>
          <Input ref="curPage" title={title} defaultValue={this.props.current} type="text" onPressEnter={this.switchPage.bind(this)}/><br />
          <InputNumber ref="pageSize" size="small" min={10} step={10} max={200} defaultValue={this.props.pageSize} onChange={this.handlePageSize.bind(this)} />
        </div>
      </div>
    )
  }
}

export default SimplePager
