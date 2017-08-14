import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { Table, Icon, Button, Popover } from 'antd'
import SimplePager from 'components/SimplePager'
import { classnames, request } from 'utils'
import styles from './List.less'
import layout from 'utils/layout'
import { isPaginationEqual } from 'utils'

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
      clickedKeyId: props.clickedKeyId || null,
      scroll: undefined,
      pager: {
        top: 8
      },
      isPopoverVisible: props.isPopoverVisible,
    }
  }

  componentDidMount () {
    this.handleTableChange()
    if (this.props.autoHeight !== false) this.timerCheckWindow = setInterval(this.checkWindowResize.bind(this), 500)
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
    let node = ReactDOM.findDOMNode(this.refs.QwpList)
    if (!node) return
    let h
    if (this.props.autoHeight !== false) {
      node = node.querySelector('.ant-table-body')
      h = layout.calcFullFillHeight(node)
    } else if (this.props.height) {
      node = node.querySelector('.ant-table-body')
      h = this.props.height
    }
    if (h) {
      layout.addSimscroll(node, h)
      this.setState({
        scroll: {y: h}
      })
    }
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
                       (nextProps.fetchData && !lodash.isEqual(this.props.fetchData, nextProps.fetchData))
    let controlPopover = (nextProps.isPopoverVisible === true || nextProps.isPopoverVisible === false) && nextProps.isPopoverVisible !== this.state.isPopoverVisible
    if (needLoadData) {
      this.props = nextProps
      let state = this.createNewState(false, false, false, nextProps)
      if (controlPopover) state.isPopoverVisible = nextProps.isPopoverVisible
      this.setState(state, this.fetch)
    } else if (controlPopover) {
      this.setState({
        isPopoverVisible: nextProps.isPopoverVisible,
      })
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

  onMouseMove (event) {
    if (!this.state.pager) return
    let list = ReactDOM.findDOMNode(this.refs.QwpList)
    if (!list) return
    let node = layout.$(event.target).closest('.ant-table-row')
    if (node.length === 0) return
    list = layout.$(list)
    let top = node.offset().top - list.offset().top
    let pagerNode = layout.$(ReactDOM.findDOMNode(this.refs.QwpListPager))
    let delta = top + pagerNode.height() - list.height()
    if (delta > 0) {
      top -= delta
      if (top < 0) top = 0
    }
    let listTop = list.find('.ant-table-tbody').offset()
    if (top < listTop) top = listTop
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
    else if (this.props.dataConvertor) result = this.props.dataConvertor(result)
    pagination.total = result.total || 0
    pagination.totalPage = Math.ceil(result.total / pagination.pageSize)
    if (pagination.totalPage === NaN) pagination.totalPage = 1
    this.setState({
      loading: false,
      dataSource: this.props.dataKey ? result[this.props.dataKey] : result.data,
      pagination,
    }, this.onSizeChanged)
  }

  fetch () {
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

  onFilter () {

  }

  onChange (selectedRowKeys, selectedRows) {

  }

  onSearch () {
    if (this.props.onSearch) this.props.onSearch()
  }

  handleSearchPopoverVisibleChange (visible) {
    this.setState({
      isPopoverVisible: visible,
    })
  }

  render () {
    let { fetch, 
      header,
      dataIndex,
      render,
      onRowClick,
      onRowDoubleClick,
      autoHeight,
      name,
      filter,
      noPagination,
      className,
      selectionType,
      searchContent,
      ...tableProps,
    } = this.props
    const { loading, pagination } = this.state

    if (selectionType) {
      tableProps.rowSelection = {type: selectionType}
    }    
    let col = {
      title: this.props.header || '',
    }

    if (searchContent) {
      col.title = (<div>{col.title}<div className={styles.headerBtns}>
        <Popover placement="bottomLeft" trigger="click" content={searchContent} overlayClassName={styles.listSearchPopover} onVisibleChange={this.handleSearchPopoverVisibleChange.bind(this)} visible={this.state.isPopoverVisible}>
          <Button onClick={this.onSearch.bind(this)} type="primary" size="small" shape="circle" icon="search" />
        </Popover>
      </div></div>)
    }
    if (filter) {
      const { filters, filterMultiple, filterDropdown } = filter
      col.filters = filters
      if (filterDropdown) col.filterDropdown = filterDropdown
      if (filterMultiple) col.filterMultiple = filterMultiple
      col.onFilter = this.onFilter
    }
    if (dataIndex) col.dataIndex = dataIndex
    if (render) col.render = render
    col.className = 'qwp-list-cell'
    tableProps.columns = [col]
    tableProps.showHeader = header || selectionType === 'checkbox' || filter ? true : false
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
    return (<div ref="QwpList" className="qwp-list" onMouseMove={this.onMouseMove.bind(this)}>
      {this.state.pager && <div ref="QwpListPager" className="qwp-list-pager" style={{ top: this.state.pager.top || 8 }}><SimplePager {...pagerProps}/></div>}
      <Table
        className={className}
        size="middle"
        loading={loading}
        {...tableProps}
        onChange={this.onChange}
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