import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import styles from './UserTable.less'
import classnames from 'classnames'
import DateTable from 'components/DataTable'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import RandomAvatar from 'components/Helper/RandomAvatar'
import uri from 'utils/uri'
import layout from 'utils/layout'

const confirm = Modal.confirm

const colOptions = {
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

const UserTable = ({ onDeleteItem, onEditItem, isMotion, location, keyId, tables, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
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
  }
  tableProps.fetch = uri.ops({m: 'user', ops: 'list', mock: true})
  tableProps.columns = layout.getTableColumn(tables, colOptions)

  return (
    <DateTable
      {...tableProps}
      className={styles.table}
      rowKey={record => keyId ? record[keyId] : record.id}
    />
  )
}

UserTable.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default UserTable
