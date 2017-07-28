import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import { config } from 'utils'
import { createOkHander } from 'utils/form'
import { l } from 'utils/localization'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'
import styles from './index.less'

const FormItem = Form.Item

class LoginForm extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    const formProps = {
      formName: "login",
      fields: [
        {
          id: "user",
          input: "text",
          placeholder: l("Username"),
          inputProps: {
            size: 'large',
            onPressEnter: this.props.handleOk
          },
        },{
          id: "pwd",
          input: "password",
          placeholder: l("Password"),
          inputProps: {
            size: 'large',
            onPressEnter: this.props.handleOk
          },
        }
      ],
      ...this.props,
    }
    return (
      <HorizontalFormGenerator {...formProps}/>
    )
  }
}

const Passport = ({
  passport,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
  },
  app,
}) => {
  const { loginLoading } = passport
  const handleOk = createOkHander(validateFieldsAndScroll, getFieldsValue, (data) => { dispatch({ type: 'passport/login', payload: data }) })
  const formProps = {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
    noFormItemLayout: true,
    appSettings: app.appSettings,
    handleOk,
  }

  return (
    <div loc={app.localeChangedTag} className={styles.form}>
      <div className={styles.loginTitle}>
        <span>{l('productName')}</span>
      </div>
      <p style={ {paddingBottom: 8, textAlign: 'left'} }>
        <span>{l('Please login')}:</span>
      </p>
      <LoginForm {...formProps}/>
      <Row>
        <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
          {l('Sign in')}
        </Button>
        <p>
          <span>Username：guest</span>
          <span>Password：guest</span>
        </p>
      </Row>
    </div>
  )
}

Passport.propTypes = {
  form: PropTypes.object,
  passport: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default connect(({ app, passport }) => ({ app, passport }))(Form.create()(Passport))
