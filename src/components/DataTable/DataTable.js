import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col, Form, Icon } from 'antd'
import { request } from 'utils'
import layout from 'utils/layout'
import lodash from 'lodash'
import styles from './DataTable.less'
import { isPaginationEqual } from 'utils'
import { l } from 'utils/localization'
import { createOkHander } from 'utils/form'
import { HorizontalFormGenerator, MultiColHorizontalFormGenerator } from 'components/Helper/FormGenerator'

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
        showTotal: total => l('Total items: {0}', total),
        current: 1,
        pageSize: 30,
      },
      scroll: undefined,
    }
  }

  calcColumnsWidth () {
    let cols = []
    if (!this.props.columns) return false
    let node = this.dataTable
    if (!node) return cols
    node = layout.$(node).find('.ant-table-body > table')
    let total = 0
    let width = node.width()
    let tw = 0

    for (let item of this.props.columns) {
      if (lodash.isString(item.width)) total += parseInt(item.width)
      else width -= item.width
    }
    for (let item of this.props.columns) {
      let copy = {...item}
      if (lodash.isString(item.width)) {
        copy.width = parseInt(width * parseInt(item.width) / total)
      }
      tw += copy.width
      cols.push(copy)
    }
    cols[cols.length - 1].width += width - tw
    return cols
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
    let node = this.dataTable
    if (!node) return
    this.resizeState = layout.getResizeState(node, this.resizeState)
    if (this.resizeState.needResize) this.onSizeChanged()
  }

  setScrollBarSize () {
    let dataTable = this.dataTable
    if (!dataTable) return
    let state = {}
    if (this.props.autoHeight !== false) {
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
    if (state.scroll) this.setState(state)
  }

  onSizeChanged () {
    let dataTable = this.dataTable
    if (!dataTable) return
    this.setState({
      columns: this.calcColumnsWidth(),
    }, this.setScrollBarSize)
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

  onSearch (data) {
    if (this.inlineSearchContentInner) {
      this.setState({
        fetchData: {
          ...this.state.fetchData,
          ...data,
        },
      }, this.fetch)
      return
    }
    if (!this.state.isSearchVisible) {
      let tableNode = this.dataTable
      if (tableNode) {
        tableNode = layout.$(tableNode)
        let searchContent = this.searchContentNode
        if (searchContent) {
          searchContent = layout.$(searchContent)
          searchContent.css('top', tableNode.find('.ant-table-tbody').offset().top - tableNode.offset().top + 'px')
          searchContent.width(tableNode.width() - 8)
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

  createSearchContent (searchContent) {
    if (!lodash.isUndefined(this.searchContentInner) || !lodash.isUndefined(this.inlineSearchContentInner)) return
    if (!lodash.isFunction(searchContent)) {
      const {
        form,
        appSettings,
        formItems,
      } = searchContent
      const handleOk = createOkHander(form.validateFieldsAndScroll, form.getFieldsValue,
        searchContent.inline ? this.onSearch.bind(this) : this.handleSearchOk.bind(this), 's')
      let formProps = { ...formItems }
      if (!formProps.fields[formProps.fields.length - 1].sentinel) {
        if (searchContent.inline) {
          formProps.fields.push({
            content: (<Button.Group size="medium">
              <Button className={styles.btnMarginRight} type="primary" onClick={handleOk} icon="search" />
              <Button type="default" htmlType="reset" onClick={this.onResetSearchContent.bind(this)} icon="close" />
            </Button.Group>),
            itemProps: {
              className: styles.searchBtns,
            },
            sentinel: true
          })
          formProps.hasFeedback = false
        } else {
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
              style: { marginRight: 0 },
            },
          })
        }
      }
      formProps.getFieldDecorator = form.getFieldDecorator
      formProps.validateFieldsAndScroll = form.validateFieldsAndScroll
      formProps.getFieldsValue = form.getFieldsValue
      formProps.resetFields = form.resetFields
      formProps.noFormItemLayout = true
      formProps.appSettings = appSettings
      formProps.handleOk = handleOk
      if (searchContent.inline) {
        formProps.layout = 'inline'
        this.inlineSearchContentInner = (<HorizontalFormGenerator {...formProps} />)
      } else {
        this.searchContentInner = (<MultiColHorizontalFormGenerator {...formProps} />)
      }
    } else {
      this.searchContentInner = ''
      this.inlineSearchContentInner = ''
    }
  }

  render () {
    const {
      fetch,
      columns,
      searchContent,
      operations,
      ...tableProps
    } = this.props
    const { loading, dataSource, pagination } = this.state
    if (this.state.columns) tableProps.columns = this.state.columns
    else if (columns) tableProps.columns = columns
    if (searchContent) this.createSearchContent(searchContent)
    let props = {
      locale: {
        emptyText: (<div><span><Icon type="info-circle-o" /> {l('Data record is empty')}</span><Button type="ghost" icon="reload" size="small" shape="circle-outline" onClick={this.fetch.bind(this)} /></div>),
      }
    }
    return (
      <div className="qwp-data-table" ref={n => this.dataTable = n}>
        <Row style={{ display: searchContent || operations ? 'block' : 'none' }} className={styles.dataTableHeader}>
          <Col span={12} style={{ display: operations ? 'block' : 'none' }}>
            {operations}
          </Col>
          <Col span={12} style={{ display: searchContent ? 'block' : 'none', textAlign: 'right' }}>
            {this.inlineSearchContentInner ? this.inlineSearchContentInner : <Button onClick={lodash.isFunction(searchContent) ? searchContent : this.onSearch.bind(this)} type="primary" size="small" shape="circle" icon="search" />}
          </Col>
        </Row>
        <div ref={n => this.searchContentNode = n} className={styles.searchContent} style={{ display: this.searchContentInner && this.state.isSearchVisible ? 'block' : 'none' }}>
          {this.searchContentInner}
        </div>
        <Table
          {...tableProps}
          {...props}
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
