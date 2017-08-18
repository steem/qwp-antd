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
    }))},
    appSettings: moduleSettings,
  }

  let userTableProps = {
    location,
    tables: moduleSettings.tables.userList,
    appSettings: moduleSettings,
    dispatch,
    loading,
    user,
  }
  const org = uri.param('org')
  if (org) {
    userTableProps.fetchData = {
      s: {
        org,
      }
    }
  }
  const isLoading = loading.effects['user/init'] || loading.effects['user/onEnter']
  return (
    <div className="content-inner">
      {isLoading ? <Loader spinning={isLoading} /> :
      <Row gutter={24} className={styles.colPadding}>
        <Col span={4}><OrgList {...orgListProps}/></Col>
        <Col span={20}>
          {moduleSettings.tables.userList ? <UserTable {...userTableProps} /> : <Error error={l('Failed to load user table')} />}
        </Col>
      </Row>}
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
