import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
import { getFormFieldRule } from 'utils/form'
import { l } from 'utils/localization'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}

const modal = ({
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  appSettings,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    title: l('Change your password'),
    onOk: handleOk,
  }
  let formName = 'changePassword'
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label={l("New password")} hasFeedback {...formItemLayout}>
          {
            getFormFieldRule(
              appSettings, 
              formName, 
              'pwd1', 
              getFieldDecorator
            )(<Input type="password" />)
          }
        </FormItem>
        <FormItem label={l("Password confirmation")} hasFeedback {...formItemLayout}>
          {
            getFormFieldRule(
              appSettings, 
              formName, 
              'pwd2', 
              getFieldDecorator
            )(<Input type="password" />)
          }
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
  appSettings: PropTypes.object.isRequired,
}

export default Form.create()(modal)
