import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Loader } from 'components'
import uri from 'utils/uri'
import OrgList from './OrgList'
import UserTable from './UserTable'
import Filter from './Filter'
import Modal from './Modal'
import styles from './index.less'

const User = ({ location, dispatch, user, loading, app }) => {
  const { list, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, moduleSettings } = user

  let orgListProps = {
    location,
    clickedKeyId: uri.param('org', -1),
    onRowClick: (record, idx, org) => {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          org,
        },
      }))}
  }

  let userTableProps = {
    location,
    fetchData: {org: uri.param('org')},
    tables: moduleSettings.tables.userList,
  }
  return (
    <div className="content-inner">
      <Row gutter={24} className={styles.colPadding}>
        <Col span={4}><OrgList {...orgListProps}/></Col>
        <Col span={20}>
          {moduleSettings.tables.userList ? <UserTable {...userTableProps} /> : <Loader spinning={loading.effects['user/init']} />}
        </Col>
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
