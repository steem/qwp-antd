import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { Table, Icon } from 'antd'
import SimplePager from 'components/SimplePager'
import { classnames, request } from 'utils'
import styles from './List.less'
import layout from 'utils/layout'
import { isPaginationEqual } from 'utils'

const fnListName = name => 'QwpList_' + name

class List extends React.Component {
  constructor (props) {
    super(props)
    const { dataSource, pagination } = props
    this.state = {
      loading: false,
      dataSource,
      fetchData: {},
      pagination: pagination || {
        current: 1,
        pageSize: props.pageSize || 30,
        total: 0,
        totalPage: 0,
      },
      clickedKeyId: lodash.isInteger(props.clickedKeyId) ? lodash.isInteger(props.clickedKeyId) : -1,
      scroll: undefined,
      pager: {
        top: 8
      },
    }
  }

  componentDidMount () {
    this.handleTableChange()
    if (this.props.autoSize !== false) this.timerCheckWindow = setInterval(this.checkWindowResize.bind(this), 500)
  }

  componentWillUnmount () {
    if (this.timerCheckWindow) {
      clearInterval(this.timerCheckWindow)
      this.timerCheckWindow = null
    }
  }

  checkWindowResize () {
    let node = ReactDOM.findDOMNode(this.refs.QwpList)
    if (!node) return
    this.resizeState = layout.getResizeState(node, this.resizeState)
    if (this.resizeState.needResize) this.onSizeChanged()
  }

  onSizeChanged () {
    if (this.props.autoSize === false) return
    let node = ReactDOM.findDOMNode(this.refs.QwpList)
    if (!node) return
    node = node.querySelector('.ant-table-body')
    let h = layout.calcFullFillHeight(node)
    layout.addSimscroll(node, h)
    this.setState({
      scroll: {y: h}
    })
  }

  createNewState (pagination, filters, sorter, nextProps) {
    let props = {pagination: {...this.state.pagination}}
    if (pagination) {
      props.pagination.current = pagination.current
      if (pagination.pageSize) props.pagination.pageSize = pagination.pageSize
    } else if (nextProps && nextProps.pagination) {
      props.pagination = nextProps.pagination
    }
    let fetchData = filters ? {...this.state.fetchData, ...filters} : {...this.state.fetchData}
    if (nextProps) {
      if (nextProps.fetch) props.fetch = nextProps.fetch
      if (nextProps.fetchData) fetchData = {...fetchData, ...nextProps.fetchData}
      props.pagination.current = 1
    }
    if (sorter) {
      if (sorter.field) fetchData.sortField = sorter.field
      if (sorter.order) fetchData.sortOrder = sorter.order
    }
    fetchData.pageSize = props.pagination.pageSize
    fetchData.page = props.pagination.current
    props.fetchData = fetchData
    return props
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.fetch || lodash.isFunction(nextProps.fetch)) {
      this.props = nextProps
      return
    }
    let needLoadData = (nextProps.pagination && !isPaginationEqual(nextProps.pagination, this.state.pagination)) || 
                       (nextProps.fetch && !lodash.isEqual(nextProps.fetch, this.props.fetch)) ||
                       (nextProps.fetchData && !lodash.this.props.fetchData(this.props.fetchData, nextProps.fetchData))
    if (needLoadData) {
      this.props = nextProps
      this.setState(this.createNewState(false, false, false, nextProps), this.fetch)
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(this.createNewState(pagination, filters, sorter), this.fetch)
  }

  switchPage = (current, pageSize) => {
    if (!current) {
      this.handleTableChange({...this.state.pagination})
    } else {
      this.handleTableChange({current, pageSize})
    }
  }

  getRecordKey = (record) => {
    return this.props.keyId ? record[this.props.keyId] : record.id
  }

  handleRowClick = (record, index, event) => {
    let newClicked = this.getRecordKey(record)
    if (this.props.onRowClick) this.props.onRowClick(record, index, newClicked)
    if (newClicked != this.state.clickedKeyId) this.setState({clickedKeyId: newClicked})
  }

  handleRowDoubleClick = (record, index, event) => {
    if (this.props.onRowDoubleClick) this.props.onRowDoubleClick(record, index)
  }

  getRowClassName = (record, index) => {
    return this.getRecordKey(record) === this.state.clickedKeyId ? styles.selectedCell : ''
  }

  onMouseMove = (event) => {
    if (!this.state.pager) return
    let node = layout.$(event.target).closest('.ant-table-row')
    if (node.length === 0) return
    let list = layout.$(ReactDOM.findDOMNode(this.refs.QwpList))
    let top = node.offset().top - list.offset().top
    let pagerNode = layout.$(ReactDOM.findDOMNode(this.refs.QwpListPager))
    let delta = top + pagerNode.height() - list.height()
    if (delta > 0) {
      top -= delta
      if (top < 0) top = 0
    }
    if (top === this.state.pager.top) return
    let pager = {
      top,
    }
    this.setState({
      pager,
    })
  }

  onUpdateData (result) {
    let { pagination } = this.state
    if (result.data && lodash.isNumber(result.data.total)) result = result.data
    pagination.total = result.total || 0
    pagination.totalPage = Math.ceil(result.total / pagination.pageSize)
    if (pagination.totalPage === NaN) pagination.totalPage = 1
    this.setState({
      loading: false,
      dataSource: this.props.dataKey ? result[this.props.dataKey] : result.data,
      pagination,
    }, this.onSizeChanged)
  }

  fetch = () => {
    if (!this.props.fetch) return
    const { fetchData } = this.state
    if (lodash.isFunction(this.props.fetch)) {
      this.setState({ loading: true })
      this.props.fetch({...fetchData}, this.onUpdateData.bind(this))
      return
    }
    this.setState({ loading: true })
    this.promise = request({
      url: this.props.fetch,
      data: {
        ...fetchData,
      },
    }).then(this.onUpdateData.bind(this))
  }

  render () {
    let { fetch, 
      showCheckbox, 
      header,
      dataIndex,
      render,
      onRowClick,
      onRowDoubleClick,
      autoSize,
      name,
      noPagination,
      className,
      ...tableProps,
    } = this.props
    const { loading, pagination } = this.state

    tableProps.rowSelection = showCheckbox ? {} : undefined
    let col = {
      title: this.props.header || '',
    }
    if (dataIndex) col.dataIndex = dataIndex
    if (render) col.render = render
    col.className = 'qwp-list-cell'
    tableProps.columns = [col]
    tableProps.showHeader = header || showCheckbox ? true : false
    tableProps.bordered = false
    tableProps.onRowClick = this.handleRowClick
    tableProps.onRowDoubleClick = this.handleRowDoubleClick
    tableProps.rowClassName = this.getRowClassName
    tableProps.pagination = false
    let pagerProps = {}
    if (this.state.pager) {
      pagerProps = {
        ...pagination,
        onSwitchPage: this.switchPage,
      }
    }
    return (<div ref="QwpList" className="qwp-list" onMouseMove={this.onMouseMove}>
      {this.state.pager && <div ref="QwpListPager" className="qwp-list-pager" style={{ top: this.state.pager.top || 8 }}><SimplePager {...pagerProps}/></div>}
      <Table
        className={className}
        size="middle"
        loading={loading}
        {...tableProps}
        dataSource={this.state.dataSource}
        scroll={this.state.scroll}
      />
    </div>)
  }
}


List.propTypes = {
  fetch: PropTypes.object,
  rowKey: PropTypes.string,
  dataSource: PropTypes.array,
}

export default List
