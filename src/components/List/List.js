import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { Table, Icon, Button, Popover, Menu, Dropdown } from 'antd'
import SimplePager from 'components/SimplePager'
import { classnames, request } from 'utils'
import styles from './List.less'
import layout from 'utils/layout'
import { isPaginationEqual } from 'utils'
import { l } from 'utils/localization'
import { createOkHander } from 'utils/form'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'

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
        top: 8,
      },
      isSearchVisible: props.isSearchVisible,
    }
    if (props.sort) {
      this.state.fetchData.sortField = props.sort.field
      this.state.fetchData.sortOrder = props.sort.order || 'desc'
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
    let node = this.QwpList
    if (!node) return
    this.resizeState = layout.getResizeState(node, this.resizeState)
    if (this.resizeState.needResize) this.onSizeChanged()
  }

  onSizeChanged () {
    let node = this.QwpList
    if (!node) return
    let h
    let emptyRecord = layout.$(this.QwpList.querySelector('.ant-table-placeholder'))
    let isEmpty = emptyRecord.length > 0 && emptyRecord.is(':visible')
    if (this.props.autoHeight !== false) {
      node = node.querySelector('.ant-table-body')
      h = 8
      if (isEmpty) emptyRecord.height(layout.calcFullFillHeight(emptyRecord) - layout.getHeightWithoutContent(emptyRecord))
      else h = layout.calcFullFillHeight(node)
    } else if (this.props.height) {
      h = this.props.height
      node = node.querySelector('.ant-table-body')
      if (isEmpty) {
        emptyRecord.height(this.props.height)
        h = 8
      }
    }
    if (lodash.isInteger(h)) {
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
                       (nextProps.fetchData && !lodash.isMatch(this.props.fetchData, nextProps.fetchData))
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

  onMouseMove (event) {
    if (!this.state.pager) return
    let list = this.QwpList
    if (!list) return
    list = layout.$(list)
    let node = layout.$(event.target).closest('.ant-table-row')
    if (node.length === 0) {
      node = layout.$(event.target).closest('.ant-table-header')
      if (node.length === 0) return;
      let emptyNode = list.find('.ant-table-placeholder')
      if (emptyNode.length > 0 && emptyNode.is(':visible')) node = emptyNode
      else node = list.find('.ant-table-tbody')
    }
    let top = node.offset().top - list.offset().top
    let pagerNode = layout.$(this.QwpListPager)
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
    if (this.props.onDataUpdated) this.props.onDataUpdated()
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

  onSearch () {
    if (!this.state.isSearchVisible) {
      let list = this.QwpList
      if (list) {
        list = layout.$(list)
        let searchContent = this.searchContent
        if (searchContent) {
          searchContent = layout.$(searchContent)
          searchContent.css('top', list.find('.ant-table-tbody').offset().top - list.offset().top + 'px')
          searchContent.width(list.width() - 8)
        }
      }
    }
    this.setState({
      isSearchVisible: !this.state.isSearchVisible,
    })
  }

  handleSearchOk (data) {
    this.setState({
      fetchData: {
        ...this.state.fetchData,
        ...data,
      },
      isSearchVisible: false,
    }, this.fetch)
  }

  onResetSearchContent () {
    this.props.searchContent.form.resetFields()
  }

  onSort() {
    this.setState({
      fetchData: {
        ...this.state.fetchData,
        sortOrder: this.state.fetchData.sortOrder === 'desc' ? 'asc' : 'desc',
      },
    }, this.fetch)
  }

  changeSortField(item) {
    if (item.key === this.state.fetchData.sortField) return
      this.setState({
        fetchData: {
          ...this.state.fetchData,
          sortField: item.key,
        },
      }, this.fetch)
  }

  createSearchContent (col, searchContent, sort) {
    let scFn = lodash.isFunction(searchContent)
    let sortItems
    if (sort && sort.fields) {
      let sortField = this.state.fetchData.sortField
      let menus = (
        <Menu onClick={this.changeSortField.bind(this)} className={styles.orderMenu}>
          {
            sort.fields.map(item => {
              let selected = sortField === item.id
              return (<Menu.Item key={item.id} className={classnames(styles.sortFieldItem, {[styles.sortFieldItemSelected] : selected})}>
                  <Icon type={selected ? "check" : "tag-o"} />
                  {selected ? l('Current') : l('Order by')}: {item.name}
                </Menu.Item>)
            })
          }
        </Menu>
      )
      sortItems = (
        <Dropdown overlay={menus} trigger={['click']}>
          <Button title={l('Change sort field')} className={styles.headerBtn} type="ghost" icon="bars" />
        </Dropdown>
      )
    }
    col.title = (<div>{col.title}<div className={styles.headerBtns}>
      <Button.Group size="small">
        <Button className={styles.headerBtn} onClick={scFn ? searchContent : this.onSearch.bind(this)} type="ghost" icon="search" />
        {sortItems}
        {sort && <Button title={l('Change sort order')} className={styles.headerBtn} onClick={this.onSort.bind(this)} type="ghost" icon={this.state.fetchData.sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} />}
      </Button.Group>
    </div></div>)
    if (!lodash.isUndefined(this.searchContentInner)) return
    if (!scFn) {
      const {
        form,
        appSettings,
        formItems,
      } = searchContent
      const handleOk = createOkHander(form.validateFieldsAndScroll, form.getFieldsValue,
        this.handleSearchOk.bind(this), 's')
      let formProps = { ...formItems }
      formProps.fields.push({
        content: (<div>
          <Button className={styles.btnMarginRight} type="primary" size="small" onClick={handleOk}>
            {l('Search')}
          </Button>
          <Button type="primary" size="small" htmlType="reset" onClick={this.onResetSearchContent.bind(this)}>
            {l('Clear')}
          </Button>
        </div>),
        itemProps: {
          className: styles.searchBtns,
        },
      })
      formProps.getFieldDecorator = form.getFieldDecorator
      formProps.validateFieldsAndScroll = form.validateFieldsAndScroll
      formProps.getFieldsValue = form.getFieldsValue
      formProps.resetFields = form.resetFields
      formProps.noFormItemLayout = true
      formProps.appSettings = appSettings
      formProps.handleOk = handleOk
      this.searchContentInner = (<HorizontalFormGenerator {...formProps} />)
    } else {
      this.searchContentInner = ''
    }
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
      noPagination,
      className,
      selectionType,
      searchContent,
      sort,
      ...tableProps,
    } = this.props
    const { loading, pagination } = this.state

    if (selectionType) {
      if (lodash.isString(selectionType)) tableProps.rowSelection = {type: selectionType}
      else tableProps.rowSelection = selectionType
    }
    let col = {
      title: this.props.header || '',
    }
    if (searchContent) this.createSearchContent(col, searchContent, sort)
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
    tableProps.locale = {
      emptyText: (<div><span><Icon type="info-circle-o" /> {l('Data record is empty')}</span><Button type="ghost" icon="reload" size="small" shape="circle-outline" onClick={this.fetch.bind(this)} /></div>),
    }
    let pagerProps = {}
    if (this.state.pager) {
      pagerProps = {
        ...pagination,
        onSwitchPage: this.switchPage,
      }
    }
    return (<div ref={n => this.QwpList = n} className={classnames(styles.qwpList, {[styles.showSearch]: this.state.isSearchVisible})} onMouseMove={this.onMouseMove.bind(this)}>
      {this.state.pager && <div ref={n => this.QwpListPager = n} className="qwp-list-pager" style={{ top: this.state.pager.top || 8 }}><SimplePager {...pagerProps}/></div>}
      <div ref={n => this.searchContent = n} className={styles.searchContent} style={{ display: this.state.isSearchVisible ? 'block' : 'none' }}>
        {this.searchContentInner}
      </div>
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
