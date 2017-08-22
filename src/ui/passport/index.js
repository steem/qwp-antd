import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Icon } from 'antd'
import { config } from 'utils'
import { createOkHander } from 'utils/form'
import { l } from 'utils/localization'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'
import styles from './index.less'

class LoginForm extends React.Component {
  render() {
    const formProps = {
      name: 'login',
      fields: [{
        id: 'user',
        input: 'text',
        placeholder: l('Username'),
        inputProps: {
          size: 'large',
          onPressEnter: this.props.handleOk,
        },
        addonBefore: {
          id: 'area',
          select: [{
            name: l('Beijing'),
            value: 'bj',
          }, {
            name: l('Shenzhen'),
            value: 'sz',
          }],
          defaultValue: 'bj',
          placeholder: l('Please select area'),
        }
      }, {
        id: 'pwd',
        input: 'password',
        placeholder: l('Password'),
        inputProps: {
          size: 'large',
          onPressEnter: this.props.handleOk,
        },
      }, {
        id: 'chk',
        checkboxGroup: true,
        placeholder: l('Password'),
        inputProps: {
          options: ['Apple', 'Pear', 'Orange'],
          value: ['Apple', 'Pear', 'Orange'],
          defaultValue: ['Apple', 'Orange'],
        },
      }, {
        id: 'role',
        select: [{
          name: l('User'),
          value: 'user',
        }, {
          name: l('Administrator'),
          value: 'admin',
        }],
        defaultValue: 'user',
        placeholder: l('Please select role'),
        inputProps: {
          multiple: true,
          size: 'large',
          onPressEnter: this.props.handleOk,
        },
      }, {
        inputGroup: [{
          id: 'option1',
          input: 'text',
          placeholder: l('Opt1'),
          inputProps: {
            onPressEnter: this.props.handleOk,
          },
        }, {
          id: 'option2',
          input: 'text',
          placeholder: l('Opt2'),
          inputProps: {
            onPressEnter: this.props.handleOk,
          },
        }, {
          id: 'option3',
          input: 'text',
          placeholder: l('Opt3'),
          inputProps: {
            onPressEnter: this.props.handleOk,
          },
        }, {
          id: 'option4',
          input: 'text',
          placeholder: l('Opt4'),
          inputProps: {
            onPressEnter: this.props.handleOk,
          },
        }],
        span: 6,
        itemProps: {
          labelCol: {
            span: 6,
          },
          wrapperCol: {
            span: 24,
          },
        }
      }],
    }
    return (<HorizontalFormGenerator {...formProps} {...this.props}/>)
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
  const {
    loginLoading
  } = passport
  const handleOk = createOkHander(validateFieldsAndScroll, getFieldsValue, (data) => {
    dispatch({
      type: 'passport/login',
      payload: data
    })
  })
  const formProps = {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
    noFormItemLayout: true,
    appSettings: app.appSettings,
    handleOk,
  }

  return (
    <div>
      <div loc={app.localeChangedTag} className={styles.form}>
        <div className={styles.loginTitle}>
          <img alt={'logo'} src={config.logo} />
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
        </Row>
      </div>
    </div>
  )
}

Passport.propTypes = {
  form: PropTypes.object,
  passport: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
}

export default connect(({
  app,
  passport
}) => ({
  app,
  passport
}))(Form.create()(Passport))
