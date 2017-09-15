import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import List from 'components/List'
import { l } from 'utils/localization'
import { uriOfList } from 'requests/org'
import styles from './OrgList.less'

let OrgListWithSearchForm = React.createClass({
  updateModalOrgSelection(selectedOrgKeys) {
    this.props.dispatch({
      type: 'user/updateState',
      payload: {
        selectedOrgKeys,
      },
    })
  },

  onSelectionChanged(selectedOrgKeys, selectedRows) {
    this.updateModalOrgSelection(selectedOrgKeys)
  },

  onDataUpdated() {
    this.updateModalOrgSelection([])
  },

  render () {
    const {
      user,
      location,
      form,
      appSettings,
      ...listProps,
    } = this.props
    const searchContent = {
      form,
      appSettings,
      formItems:{
        name: 'org',
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
      header: l('Organizations'),
      selectionType: {
        type: 'checkbox',
        onChange: this.onSelectionChanged,
        selectedRowKeys: user.selectedOrgKeys,
      },
      sort: {
        order: 'desc',
        field: 'id',
        fields: [{
          id: 'id',
          name: l('ID'),
        }, {
          id: 'name',
          name: l('Name'),
        },],
      },
      fetch: uriOfList(),
      dataIndex: 'name',
      searchContent,
      onDataUpdated: this.onDataUpdated,
      clickedKeyId: location.query.org || -1,
    }
    return (<List {...listProps} { ...props} />)
  }
})

OrgListWithSearchForm.propTypes = {
  location: PropTypes.object,
  appSettings: PropTypes.object,
  form: PropTypes.object,
  user: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Form.create()(OrgListWithSearchForm)
