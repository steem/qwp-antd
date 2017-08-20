import React from 'react'
import layout from 'utils/layout'
import { Icon, Input, InputNumber, Button, message } from 'antd'
import styles from './Pager.less'
import { classnames } from 'utils'
import { l } from 'utils/localization'

class SimplePager extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expand: false,
      pageSize: this.props.pageSize,
    }
  }
  componentDidMount () {
    let node = this.pageSizeNode
    if (node) {
      node = layout.$(node).attr('title', l('Record count per page'))
    }
  }
  handleBtnClicks (event) {
    if (!this.props.onSwitchPage) return
    let node = layout.$(event.target).closest('button')
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
    let node = this.simplePager
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
    let node = this.simplePager
    if (node) {
      node = layout.$(node).closest('.qwp-list-pager')
      node.css({width: '28px', right: '-15px'})
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
      <div ref={n => this.simplePager = n} onMouseLeave={this.onLeave.bind(this)} onClick={this.handleBtnClicks.bind(this)} className={classnames(styles.hand, {[styles.expand]: this.state.expand})}>
        <Button size="small" title={title} icon="info-circle-o"/><br />
        <Button size="small" data-ops="first" title={l('First page')}><Icon type="step-forward" className="roate-270" /></Button><br />
        <Button size="small" data-ops="previous" title={l('Previous page')} icon="caret-up"/><br />
        <Button type="primary" size="small" title={l('Reload current page')} onClick={this.refresh.bind(this)} icon="reload"/><br />
        <Button size="small" data-ops="next" title={l('Next page')} icon="caret-down"/><br />
        <Button size="small" data-ops="last" title={l('Last page')}><Icon type="step-backward" className="roate-270"/></Button><br />
        <Button size="small" title={l('Goto page')} className={styles.switchPage} onClick={this.clickNumber.bind(this)} icon="edit"/>
        <div className={styles.pageSetting}>
          <Input title={title} defaultValue={this.props.current} type="text" onPressEnter={this.switchPage.bind(this)}/><br />
          <InputNumber ref={n => this.pageSizeNode = n} size="small" min={10} step={10} max={200} defaultValue={this.props.pageSize} onChange={this.handlePageSize.bind(this)} />
        </div>
      </div>
    )
  }
}

export default SimplePager
