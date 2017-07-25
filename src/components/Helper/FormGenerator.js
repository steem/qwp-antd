import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'
import { fieldRuleFn } from 'utils/form'
import { l } from 'utils/localization'
const FormItem = Form.Item

const defaultFormItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}

class HorizontalFormGenerator extends React.Component{
  constructor(props){
      super(props)
  }

  render() {
    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      appSettings,
      fields,
      formName,
    } = this.props
    const formItemLayout = this.props.formItemLayout || defaultFormItemLayout
    let fr = fieldRuleFn(appSettings, formName, getFieldDecorator)
    const items = fields.map(f => {
      if (f.input) {
        return (
          <FormItem label={l(f.label)} hasFeedback {...formItemLayout}>
            {fr(f.id)(<Input type={f.input} />)}
          </FormItem>
        )
      }
    })
    return (
      <Form layout="horizontal">
        {items}
      </Form>
    )
  }
}

module.exports = {
  HorizontalFormGenerator,
}

