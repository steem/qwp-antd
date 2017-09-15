import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Form, message } from 'antd'
import styles from './UserTable.less'
import classnames from 'classnames'
import DateTable from 'components/DataTable'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import RandomAvatar from 'components/Helper/RandomAvatar'
import { l } from 'utils/localization'
import { uriOfList } from 'requests/user'
import layout from 'utils/layout'
import { createOkHander } from 'utils/form'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'
import UserDialog from './UserDialog'

const confirm = Modal.confirm

let searchContent = {
  inline: true,
  formItems:{
    name: 'user',
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

function createColOptions(handleMenuClick, handleClickUser) {
  return {
    render: {
      avatar (text, record) {
        return (<RandomAvatar text={record.nickName.substr(0, 1)}/>)
      },
      name (text, record) {
        return (<Link title={l('Click to update user information')} onClick={e => handleClickUser(record)}>{text}</Link>)
      },
      isMale (text, record) {
        return (<span>{ text ? 'Male' : 'Female' }</span>)
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
  getInitialState () {
    this.colOptions = createColOptions(this.handleMenuClick, this.showEditUserDialog)
    this.tableColumns = layout.getTableColumn(this.props.tables, this.colOptions)
    searchContent.form = this.props.form
    searchContent.appSettings = this.props.appSettings
    return {
      createUserDialogVisible: false,
      editUserDialogVisible: false,
    }
  },

  showCreateUserDialog () {
    this.setState({
      createUserDialogVisible: true,
    })
  },

  hideCreateUserDialog () {
    this.setState({
      createUserDialogVisible: false,
    })
  },

  createUser (data) {
    this.hideCreateUserDialog()
    this.props.dispatch({
      type: 'user/create',
      payload: data,
    })
  },

  showEditUserDialog (user) {
    this.setState({
      editUserDialogVisible: true,
      selectedUser: user,
    })
  },

  hideEditUserDialog () {
    this.setState({
      editUserDialogVisible: false,
    })
  },

  editUser (data) {
    this.hideEditUserDialog()
    data.id = this.state.selectedUser.id
    this.props.dispatch({
      type: 'user/update',
      payload: data,
    })
  },

  handleEditUser () {
    if (this.props.user.selectedUserKeys.length === 0) {
      message.warning(l('No users are selected, please selected users first'))
      return
    }
    if (this.props.user.selectedUserKeys.length > 1) {
      message.warning(l('Please select just one user to edit'))
      return
    }
    this.showEditUserDialog(this.state.selectedUser)
  },

  updateModalUsersSelection (selectedUserKeys) {
    this.props.dispatch({
      type: 'user/updateState',
      payload: {
        selectedUserKeys,
      },
    })
  },

  onSelectionChanged (selectedUserKeys, selectedRows) {
    this.updateModalUsersSelection(selectedUserKeys)
    this.setState({
      selectedUser: selectedRows.length > 0 ? selectedRows[0] : 0
    })
  },

  onDataUpdated () {
    this.updateModalUsersSelection([])
  },

  handleDeleteUser () {
    this.deleteUsers()
  },

  deleteUsers (id, title) {
    if (!id) {
      if (this.props.user.selectedUserKeys.length === 0) {
        message.warning(l('No users are selected, please selected users first'))
        return
      }
      id = this.props.user.selectedUserKeys.join(',')
    }
    let dispatch = this.props.dispatch
    confirm({
      title: title || l('Are you sure to delete the selected users?'),
      onOk () {
        dispatch({
          type: 'user/delete',
          payload: {f: id},
        })
      },
    })
  },

  handleMenuClick (record, e) {
    if (e.key === '1') {
      this.showEditUserDialog(record)
    } else if (e.key === '2') {
      this.deleteUsers(record.id, l('Are you sure to delete this user?'))
    }
  },

  render () {
    const {
      location,
      keyId,
      tables,
      appSettings,
      dispatch,
      loading,
      user,
    } = this.props

    const createUserDialogProps = {
      visible: this.state.createUserDialogVisible,
      onOk: this.createUser,
      onCancel: this.hideCreateUserDialog,
      appSettings,
      create: true,
      formData: user.lastCreateUserData,
    }
    const editUserDialogProps = {
      visible: this.state.editUserDialogVisible,
      onOk: this.editUser,
      onCancel: this.hideEditUserDialog,
      appSettings,
      create: false,
      formData: this.state.selectedUser,
    }
    let tableProps = {
      fetch: uriOfList(),
      columns: this.tableColumns,
      operations: (<div className="qwp-table-perations">
          <Button.Group size="medium">
            <Button type="primary" onClick={this.showCreateUserDialog} loading={loading.effects['user/create']} icon="plus-circle-o">{l('Create')}</Button>
            <Button className="btn-warning" onClick={this.handleEditUser} loading={loading.effects['user/update']} icon="edit">{l('Edit')}</Button>
            <Button className="btn-danger" onClick={this.handleDeleteUser} loading={loading.effects['user/delete']} icon="minus-circle-o">{l('Delete')}</Button>
          </Button.Group>
          {this.state.createUserDialogVisible && <UserDialog {...createUserDialogProps}/>}
          {this.state.editUserDialogVisible && <UserDialog {...editUserDialogProps}/>}
        </div>),
      fetchData: {
        _t: user._t,
      },
      searchContent,
      onDataUpdated: this.onDataUpdated,
      rowSelection: {
        type: 'checkbox',
        onChange: this.onSelectionChanged,
        selectedRowKeys: user.selectedUserKeys,
      },
    }
    if (location.query.org) {
      tableProps.fetchData.s = {
        org: location.query.org,
      }
    }
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
  location: PropTypes.object,
  appSettings: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  user: PropTypes.object,
  form: PropTypes.object,
}

export default Form.create()(UserTable)
