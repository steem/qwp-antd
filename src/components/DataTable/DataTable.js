import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { request } from 'utils'
import layout from 'utils/layout'
import lodash from 'lodash'
import styles from './DataTable.less'
import { isPaginationEqual } from 'utils'

class DataTable extends React.Component {
  constructor (props) {
    super(props)
    const { dataSource } = props
    this.state = {
      loading: false,
      dataSource,
      fetchData: props.fetchData || {},
      pagination: props.pagination || {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        pageSize: 30,
      },
      scroll: undefined,
    }
  }

  calcColumnsWidth () {
    let cols = []
    if (!this.props.columns) return false
    let node = ReactDOM.findDOMNode(this.refs.dataTable)
    if (!node) return cols
    let total = 0
    let width = layout.$(node).width()

    for (let item of this.props.columns) {
      if (item.dynamicWidth) total += parseInt(item.width)
    }
    for (let item of this.props.columns) {
      let copy = {...item}
      if (item.dynamicWidth) {
        copy.width = parseInt(width * parseInt(item.width) / total)
        delete copy.dynamicWidth
      }
      cols.push(copy)
    }
    return cols
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
    let node = ReactDOM.findDOMNode(this.refs.dataTable)
    if (!node) return
    this.resizeState = layout.getResizeState(node, this.resizeState)
    if (this.resizeState.needResize) this.onSizeChanged()
  }

  onSizeChanged () {
    let dataTable = ReactDOM.findDOMNode(this.refs.dataTable)
    if (!dataTable) return
    let state = {
      columns: this.calcColumnsWidth(),
    }
    if (this.props.autoSize !== false) {  
      let node = dataTable.querySelector('.ant-table-body')
      let empty = dataTable.querySelector('.ant-table-placeholder')
      if (empty) empty = layout.$(empty).is(':visible')
      let h = 8
      if (!empty) h = layout.calcFullFillHeight(node, dataTable.querySelector('.ant-table-pagination'))
      layout.addSimscroll(node, h)
      state.scroll = {y: h}
    } else if (this.props.height) {
      let node = dataTable.querySelector('.ant-table-body')
      layout.addSimscroll(node, this.props.height)
      state.scroll = {y: this.props.height}
    }
    this.setState(state)
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
                       (nextProps.fetchData && !lodash.isMatch(this.props.fetchData, nextProps.fetchData))
    if (needLoadData) {
      this.props = nextProps
      this.setState(this.createNewState(false, false, false, nextProps), this.fetch)
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(this.createNewState(pagination, filters, sorter), this.fetch)
  }

  onUpdateData = (result) => {
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
    const { fetch, columns, ...tableProps } = this.props
    const { loading, dataSource, pagination } = this.state
    if (this.state.columns) tableProps.columns = this.state.columns
    else if (columns) tableProps.columns = columns
    return (
      <div className="qwp-data-table" ref="dataTable">
        <Table
          {...tableProps}
          bordered
          size="middle"
          loading={loading}
          onChange={this.handleTableChange.bind(this)}
          pagination={pagination}
          dataSource={dataSource}
          scroll={this.state.scroll}
        />
      </div>
    )
  }
}

DataTable.propTypes = {
  fetch: PropTypes.object,
  rowKey: PropTypes.string,
  pagination: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.object,
  ]),
  columns: PropTypes.array,
  dataSource: PropTypes.array,
}

export default DataTable
