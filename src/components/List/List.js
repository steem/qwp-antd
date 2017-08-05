import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { Table, Icon } from 'antd'
import SimplePager from 'components/SimplePager'
import { classnames, request } from 'utils'
import styles from './List.less'
import layout from 'utils/layout'

const fnListName = name => 'QwpList_' + name

class List extends React.Component {
  constructor (props) {
    super(props)
    const { dataSource, pagination = {
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        defaultPageSize: props.defaultPageSize ? props.defaultPageSize : 30,
      },
    } = props
    this.state = {
      loading: false,
      dataSource,
      fetchData: {},
      pagination,
      clickedIndex: -1,
      scroll: undefined,
      pager: {
        top: 8
      },
    }
  }

  componentDidMount () {
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
    let node = ReactDOM.findDOMNode(this.refs.QwpList)
    if (!node) return
    node = node.querySelector('.ant-table-body')
    let h = layout.calcFullFillHeight(node)
    layout.addSimscroll(node, h)
    this.setState({
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
      }
    }, () => {
      this.fetch()
    })
  }

  handleRowClick = (record, index, event) => {
    if (this.props.onRowClick) this.props.onRowClick(record, index)
    if (index != this.state.clickedIndex) this.setState({clickedIndex: index})
  }

  handleRowDoubleClick = (record, index, event) => {
    if (this.props.onRowDoubleClick) this.props.onRowDoubleClick(record, index)
  }

  getRowClassName = (record, index) => {
    return index === this.state.clickedIndex ? styles.selectedCell : ''
  }

  onMouseMove = (event) => {
    if (!this.state.pager) return
    let node = layout.$(event.target).closest('.ant-table-row')
    if (node.length === 0) return
    let top = node.offset().top - layout.$(ReactDOM.findDOMNode(this.refs.QwpList)).offset().top
    let pagerNode = layout.$(ReactDOM.findDOMNode(this.refs.QwpListPager))
    let delta = top + pagerNode.height() - layout.$(window).height()
    if (delta > 0) {
      top -= delta
      if (top < 0) top = 0
    }
    if (top === this.state.pager.top) return
    let pager = {
      ...this.state.pager,
      top,
    }
    this.setState({
      pager,
    })
  }

  fetch = () => {
    if (!this.props.fetch || !this.props.fetch.url) return
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
    let { fetch, 
      showCheckbox, 
      header,
      dataIndex,
      render,
      onRowClick,
      onRowDoubleClick,
      defaultPageSize,
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
      pagerProps = {...pagination}
    }
    return (<div ref="QwpList" className="qwp-list" onMouseMove={this.onMouseMove}>
      {this.state.pager && <div ref="QwpListPager" className="qwp-list-pager" style={{ top: this.state.pager.top || 8 }}><SimplePager {...pagerProps}/></div>}
      <Table
        className={className}
        size="middle"
        loading={loading}
        onChange={this.handleTableChange}
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
