import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import OrgList from './OrgList'
import UserTable from './UserTable'
import Filter from './Filter'
import Modal from './Modal'
import styles from './index.less'

const User = ({ location, dispatch, user, loading, app }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys } = user
  const { sizeChanged } = app
  const { pageSize } = pagination

  let orgListProps = {
    location,
    loading: loading.effects['user/query'],
    pagination,
  }
  let userTableProps = {
    location,
    loading: loading.effects['user/query'],
    pagination,
  }
  return (
    <div className="content-inner">
      <Row gutter={24}>
        <Col span={4}><OrgList {...orgListProps}/></Col>
        <Col span={20}><UserTable {...userTableProps} /></Col>
      </Row>
    </div>
  )
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  app: PropTypes.object,
}

export default connect(({ user, loading, app }) => ({ user, loading, app }))(User)
