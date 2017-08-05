import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { request } from 'utils'
import layout from 'utils/layout'
import lodash from 'lodash'
import styles from './DataTable.less'

class DataTable extends React.Component {
  constructor (props) {
    super(props)
    const { dataSource, pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        defaultPageSize: props.defaultPageSize ? props.defaultPageSize : 30,
      },
    } = props
    this.state = {
      loading: false,
      dataSource,
      isReady: props.isReady !== false,
      fetchData: {},
      pagination,
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
    if (!this.state.isReady) return
    if (this.props.fetch) {
      this.fetch()
    }
    this.onSizeChanged()
    layout.$(window).on('resize', lodash.debounce(this.onSizeChanged.bind(this), 200))
  }

  componentWillUnmount () {

  }

  onSizeChanged () {
    if (this.props.autoSize === false) return
    let dataTable = ReactDOM.findDOMNode(this.refs.dataTable)
    if (!dataTable) return
    let node = dataTable.querySelector('.ant-table-body')
    let h = layout.calcFullFillHeight(node, dataTable.querySelector('.ant-table-pagination'))
    layout.addSimscroll(node, h)
    this.setState({
      columns: this.calcColumnsWidth(),
      scroll: {y: h}
    })
  }

  componentWillReceiveProps (nextProps) {
    const staticNextProps = lodash.cloneDeep(nextProps)
    delete staticNextProps.columns
    const { columns, ...otherProps } = this.props

    if (!lodash.isEqual(staticNextProps, otherProps)) {
      this.props = nextProps
      this.fetch()
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = this.state.pagination
    pager.current = pagination.current
    this.setState({
      pagination: pager,
      fetchData: {
        pageSize: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      },
    }, () => {
      this.fetch()
    })
  }

  fetch = () => {
    const { fetch: { url, data, dataKey } } = this.props
    const { fetchData } = this.state
    this.setState({ loading: true })
    this.promise = request({
      url,
      data: {
        ...data,
        ...fetchData,
      },
    }).then((result) => {
      const { pagination } = this.state
      if (result.data && lodash.isNumber(result.data.total)) result = result.data
      pagination.total = result.total || 0
      this.setState({
        loading: false,
        dataSource: dataKey ? result[dataKey] : result.data,
        pagination,
      })
      setTimeout(this.onSizeChanged.bind(this), 100)
    })
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
          onChange={this.handleTableChange}
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
