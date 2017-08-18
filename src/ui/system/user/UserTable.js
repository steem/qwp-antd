import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Form } from 'antd'
import styles from './UserTable.less'
import classnames from 'classnames'
import DateTable from 'components/DataTable'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import RandomAvatar from 'components/Helper/RandomAvatar'
import { l } from 'utils/localization'
import uri from 'utils/uri'
import layout from 'utils/layout'
import { createOkHander } from 'utils/form'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'
import UserDialog from './UserDialog'

const confirm = Modal.confirm

let searchContent = {
  inline: true,
  formItems:{
    formName: 'user',
    fields: [{
      id: 'createTime',
      datePicker: true,
      placeholder: l('Create time'),
      inputProps: {
        size: 'medium',
      },
      itemProps: {
        style: { width: 100 },
      }
    }, {
      id: 'name',
      input: 'text',
      placeholder: l('Name'),
      inputProps: {
        size: 'medium',
      },
    }, ],
  }
}

function createColOptions(handleMenuClick) {
  return {
    render: {
      avatar (text, record) {
        return (<RandomAvatar text={record.nickName.substr(0, 1)}/>)
      },
      name (text, record) {
        return (<Link to={`user/${record.id}`}>{text}</Link>)
      },
      isMale (text, record) {
        return (<span>{text
                ? 'Male'
                : 'Female'}</span>)
      },
      operation (text, record) {
        return (<DropOption onMenuClick={e => handleMenuClick(record, e)} 
          menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />)
      },
    },
    className: {
      avatar: styles.avatar
    },
  }
}

let UserTable = React.createClass({
  getInitialState() {
    this.colOptions = createColOptions(this.handleMenuClick)
    searchContent.form = this.props.form
    searchContent.appSettings = this.props.appSettings
    return { createUserDialogVisible: false };
  },

  showCreateUserDialog() {
    this.setState({
      createUserDialogVisible: true,
    })
  },

  handleCreateUser() {
    
  },

  hideCreateUserDialog() {
    this.setState({
      createUserDialogVisible: false,
    })
  },

  createUser(data) {
    this.hideCreateUserDialog()
    this.props.dispatch({
      type: 'user/create',
      payload: data,
    })
  },

  handleMenuClick(record, e) {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  },

  render () {
    const { 
      onDeleteItem, 
      onEditItem, 
      location, 
      keyId, 
      tables, 
      appSettings, 
      dispatch,
      loading,
      user,
      ...tableProps,
    } = this.props

    const userDialogProps = {
      visible: this.state.createUserDialogVisible,
      onOk: this.createUser,
      onCancel: this.hideCreateUserDialog,
      appSettings,
    }

    tableProps.fetch = uri.ops({m: 'user', ops: 'list', mock: true})
    tableProps.columns = layout.getTableColumn(tables, this.colOptions)
    tableProps.operations = (<div>
      <Button type="primary" onClick={this.showCreateUserDialog} loading={loading.effects['user/create']}>{l('Create')}</Button>
      {this.state.createUserDialogVisible && <UserDialog {...userDialogProps}/>}
    </div>)
    tableProps.fetchData = {
      _t: user._t,
    }
    tableProps.searchContent = searchContent
    return (
      <DateTable
        {...tableProps}
        className={styles.table}
        rowKey={record => keyId ? record[keyId] : record.id}
      />
    )
  }
})

UserTable.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
  appSettings: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  user: PropTypes.object,
  form: PropTypes.object,
}

export default Form.create()(UserTable)

