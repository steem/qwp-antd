import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Button } from 'antd'
import List from 'components/List'
import uri from 'utils/uri'
import { l } from 'utils/localization'
import { createOkHander } from 'utils/form'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'
import styles from './OrgList.less'

class SearchFormItems extends React.Component {
  onReset () {
    this.props.resetFields()
    this.props.handleOk(this.props.getFieldsValue())
  }

  render() {
    const formProps = {
      formName: 'org',
      fields: [{
        id: 'name',
        input: 'text',
        placeholder: l('Organization name'),
        inputProps: {
          size: 'large',
          onPressEnter: this.props.handleOk,
        },
      }, {
        id: 'createTime',
        datePicker: true,
        placeholder: l('Create time'),
      }, {
        content: (<div><Button className={styles.btnMarginRight} type="primary" size="small" onClick={this.props.handleOk}>
          {l('Search')}
        </Button>
        <Button type="primary" size="small" htmlType="reset" onClick={this.onReset.bind(this)}>
          {l('Clear')}
        </Button></div>),
        itemProps: {
          className: styles.searchBtns,
        },
      }],
      ...this.props,
    }
    return (<HorizontalFormGenerator {...formProps} />)
  }
}

let OrgListWithSearchForm = React.createClass({
  getInitialState(){ 
    return {
      fetchData: {},
    }
  },
  render () {
    const {
      form: {
        getFieldDecorator,
        validateFieldsAndScroll,
        getFieldsValue,
        resetFields,
      },
      onDeleteItem,
      onEditItem,
      isMotion,
      onRowClick,
      location,
      appSettings,
      ...listProps
    } = this.props
    const handleOk = createOkHander(validateFieldsAndScroll, getFieldsValue, (data) => {
      this.setState({
        fetchData: {...data},
        isPopoverVisible: false,
      })
    }, 's')
    const formProps = {
      getFieldDecorator,
      validateFieldsAndScroll,
      getFieldsValue,
      resetFields,
      noFormItemLayout: true,
      appSettings,
      handleOk,
    }
    let searchContent = (<SearchFormItems {...formProps}/>)
    let props = {
      selectionType: 'checkbox',
      fetch: uri.ops({
        m: 'org',
        ops: 'list',
        mock: true,
      }),
      dataIndex: 'name',
      ...listProps,
      searchContent,
      onRowClick: onRowClick,
      fetchData: this.state.fetchData,
      isPopoverVisible: this.state.isPopoverVisible,
    }
    return (<List { ...props} />)
  }
})

OrgListWithSearchForm.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
  appSettings: PropTypes.object,
  form: PropTypes.object,
}

export default Form.create()(OrgListWithSearchForm)
