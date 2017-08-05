import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import styles from './UserTable.less'
import classnames from 'classnames'
import DateTable from 'components/DataTable'
import { DropOption } from 'components'
import { Link } from 'dva/router'
import uri from 'utils/uri'

const confirm = Modal.confirm

const UserTable = ({ onDeleteItem, onEditItem, isMotion, location, keyId, ...tableProps }) => {
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

  const columns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 64,
      className: styles.avatar,
      render: (text) => <img alt={'avatar'} width={24} src={text} />,
    }, {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 10,
      dynamicWidth: true,
      render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
    }, {
      title: 'NickName',
      dataIndex: 'nickName',
      width: 10,
      dynamicWidth: true,
      key: 'nickName',
    }, {
      title: 'Age',
      dataIndex: 'age',
      width: 10,
      dynamicWidth: true,
      key: 'age',
    }, {
      title: 'Gender',
      dataIndex: 'isMale',
      key: 'isMale',
      width: 10,
      dynamicWidth: true,
      render: (text) => <span>{text
            ? 'Male'
            : 'Female'}</span>,
    }, {
      title: 'Phone',
      dataIndex: 'phone',
      width: 20,
      dynamicWidth: true,
      key: 'phone',
    }, {
      title: 'Email',
      dataIndex: 'email',
      width: 20,
      dynamicWidth: true,
      key: 'email',
    }, {
      title: 'Address',
      dataIndex: 'address',
      width: 20,
      dynamicWidth: true,
      key: 'address',
    }, {
      title: 'CreateTime',
      dataIndex: 'createTime',
      width: 30,
      dynamicWidth: true,
      key: 'createTime',
    }, {
      title: '',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  tableProps.fetch = {
    url: uri.ops({m: 'user', ops: 'list', mock: true}),
  }

  tableProps.columns = columns

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
