import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import List from 'components/List'
import uri from 'utils/uri'
import { l } from 'utils/localization'
import styles from './OrgList.less'

let OrgListWithSearchForm = React.createClass({
  render () {
    const {
      onDeleteItem,
      onEditItem,
      isMotion,
      onRowClick,
      location,
      form,
      appSettings,
      ...listProps
    } = this.props
    const searchContent = {
      form,
      appSettings,
      formItems:{
        formName: 'org',
        fields: [{
          id: 'name',
          input: 'text',
          placeholder: l('Organization name'),
          inputProps: {
            size: 'large',
          },
        }, {
          id: 'createTime',
          datePicker: true,
          placeholder: l('Create time'),
        }],
      }
    }
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
