import React from 'react'
import { Form, Select, InputNumber, DatePicker, TimePicker, Switch, Radio,
         Cascader, Slider, Button, Col, Upload, Icon, Input } from 'antd'
import { fieldRuleFn } from 'utils/form'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const InputGroup = Input.Group

const defaultFormItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}

function createInputProps (f) {
  let inputProps = f.inputProps ? { ...f.inputProps } : {}
  if (f.placeholder) inputProps.placeholder = f.placeholder
  if (f.defaultValue) inputProps.defaultValue = f.defaultValue
  return inputProps
}

class FGInputGroup extends React.Component {
  render() {
    return (
      <InputGroup>
        {this.props.content}
      </InputGroup>
    )
  }
}

class FGSelect extends React.Component {
  render() {
    let inputProps = createInputProps(this.props)
    let content = this.props.select.map(item => (<Select.Option value={item.value || item.name}>{item.name}</Select.Option>))
    return (
      <Select {...inputProps}>{content}</Select>
    )
  }
}

class FGRadioGroup extends React.Component {
  render() {
    let inputProps = createInputProps(this.props)
    let content = this.props.radioBtns.map(item => (<Radio.Button value={item.value || item.name}>{item.name}</Radio.Button>))
    return (
      <RadioGroup {...inputProps}>{content}</RadioGroup>
    )
  }
}

class HorizontalFormGenerator extends React.Component {
  render() {
    const {
      getFieldDecorator,
      appSettings,
      fields,
      formName,
    } = this.props
    const formItemLayout = this.props.noFormItemLayout ? {} : this.props.formItemLayout || defaultFormItemLayout
    let fr = fieldRuleFn(appSettings, formName, getFieldDecorator)
    const items = fields.map((f) => {
      let itemProps = f.itemProps || {}
      if (f.label) itemProps.label = f.label
      if (f.input) {
        return (
          <FormItem {...itemProps} hasFeedback {...formItemLayout}>
            {fr(f.id)(<Input type={f.input} {...createInputProps(f)} />)}
          </FormItem>
        )
      } else if (f.select) {
        return (
          <FormItem {...itemProps} hasFeedback {...formItemLayout}>
            {fr(f.id)(<FGSelect {...f} />)}
          </FormItem>
        )
      } else if (f.switch) {
        return (
          <FormItem {...itemProps} hasFeedback {...formItemLayout}>
            {fr(f.id, { valuePropName: 'checked' })(<Switch />)}
          </FormItem>
        )
      } else if (f.slider) {
        return (
          <FormItem {...itemProps} hasFeedback {...formItemLayout}>
            {fr(f.id)(<Slider marks={f.marks} />)}
          </FormItem>
        )
      } else if (f.radioBtns) {
        return (
          <FormItem {...itemProps} hasFeedback {...formItemLayout}>
            {fr(f.id)(<FGRadioGroup {...f} />)}
          </FormItem>
        )
      } else if (f.inputGroup) {
        return (
          <FormItem {...itemProps} hasFeedback {...formItemLayout}>
            <InputGroup>
              {f.inputGroup.map(ipt => {
                return (
                  <Col span={ipt.span || f.span}>
                    {fr(ipt.id)(<Input type={ipt.input} {...createInputProps(ipt)} />)}
                  </Col>
                )
              })}
            </InputGroup>
          </FormItem>
        )
      }
      return (
        <FormItem {...itemProps} hasFeedback {...formItemLayout} />
      )
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

