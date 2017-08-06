import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import styles from './UserTable.less'
import classnames from 'classnames'
import List from 'components/List'
import uri from 'utils/uri'

const OrgList = ({ onDeleteItem, onEditItem, isMotion, onRowClick, location, ...listProps }) => {
  let props = {
    showCheckbox: true,
    fetch: uri.ops({m: 'org', ops: 'list', mock: true}),
    dataIndex: 'name',
    ...listProps,
    onRowClick: onRowClick,
  }
  return (
    <List {...props}/>
  )
}

OrgList.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default OrgList
