import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'
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
    title: 'Change your password',
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="New password" hasFeedback {...formItemLayout}>
          {getFieldDecorator('pwd1', {
            rules: [
              {
                required: true,
                message: 'New password is required',
              },
            ],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem label="Password confirmation" hasFeedback {...formItemLayout}>
          {getFieldDecorator('pwd2', {
            rules: [
              {
                required: true,
                message: 'Password confirmation is required'
              },
            ],
          })(<Input type="password" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
}

export default Form.create()(modal)
