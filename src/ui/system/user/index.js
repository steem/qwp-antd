import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import { Loader } from 'components'
import OrgList from './OrgList'
import UserTable from './UserTable'
import styles from './index.less'

const User = ({ location, dispatch, user, loading, app }) => {
  const { moduleSettings } = user

  let orgListProps = {
    location,
    dispatch,
    appSettings: moduleSettings,
    user,
    onRowClick: (record, idx, org) => {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          org,
        },
    }))},
  }

  let userTableProps = {
    location,
    dispatch,
    appSettings: moduleSettings,
    user,
    tables: moduleSettings.tables.userList,
    loading,
    formData: user.lastcreateUserData,
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
