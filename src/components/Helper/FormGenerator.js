import React from 'react'
import { Form, Select, InputNumber, DatePicker, TimePicker, Switch, Radio, Checkbox,
         Cascader, Slider, Button, Col, Upload, Icon, Input, Rate, TreeSelect } from 'antd'
import { fieldRuleFn } from 'utils/form'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const InputGroup = Input.Group
const { RangePicker } = DatePicker
import lodash from 'lodash'

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

class FGUpload extends React.Component {
  render() {
    let inputProps = createInputProps(this.props)
    return (
      <Upload {...inputProps}>{this.props.upload}</Upload>
    )
  }
} 

class FGRadioGroup extends React.Component {
  render() {
    let inputProps = createInputProps(this.props)
    let content = this.props.radioGroup.map(item => (<Radio.Button value={item.value || item.name}>{item.name}</Radio.Button>))
    return (
      <RadioGroup {...inputProps}>{content}</RadioGroup>
    )
  }
}

function createInput (f, fr) {
    if (f.input) {
      let addons = {}
      if (f.addonBefore) {
        if (lodash.isString(f.addonBefore) || lodash.isFunction(f.addonBefore.type)) addons.addonBefore = f.addonBefore
        else addons.addonBefore = (lodash.isArray(f.addonBefore) ? f.addonBefore : [f.addonBefore]).map((cf) => {return createInput(cf, fr)})
      }
      if (f.addonAfter) {
        if (lodash.isString(f.addonAfter) || lodash.isFunction(f.addonAfter.type)) addons.addonAfter = f.addonAfter
        else addons.addonAfter = (lodash.isArray(f.addonAfter) ? f.addonAfter : [f.addonAfter]).map((cf) => {return createInput(cf, fr)})
      }
      return fr(f.id)(<Input type={f.input} {...addons} {...createInputProps(f)} />)
    } else if (f.radio) {
      return fr(f.id)(<Radio  {...createInputProps(f)}>{f.text || ''}</Radio>)
    } else if (f.checkbox) {
      return fr(f.id)(<Checkbox  {...createInputProps(f)}>{f.text || ''}</Checkbox>)
    } else if (f.checkboxGroup) {
      return fr(f.id)(<Checkbox.Group  {...createInputProps(f)} />)
    } else if (f.select) {
      return fr(f.id)(<FGSelect {...f} />)
    } else if (f.treeSelect) {
      return fr(f.id)(<TreeSelect {...createInputProps(f)} />)
    } else if (f.switch) {
      return fr(f.id, { valuePropName: 'checked' })(<Switch />)
    } else if (f.slider) {
      return fr(f.id)(<Slider marks={f.marks} />)
    } else if (f.radioGroup) {
      return fr(f.id)(<FGRadioGroup {...f} />)
    } else if (f.inputGroup) {
      return (
        <InputGroup>
          {f.inputGroup.map(ipt => {
            return (
              <Col span={ipt.span || f.span}>
                {fr(ipt.id)(<Input type={ipt.input} {...createInputProps(ipt)} />)}
              </Col>
            )
          })}
        </InputGroup>
      )
    } else if (f.rate) {
      return fr(f.id)(<Rate {...createInputProps(f)} />)
    } else if (f.rangePicker) {
      return fr(f.id)(<RangePicker  {...createInputProps(f)} />)
    } else if (f.datePicker) {
      return fr(f.id)(<DatePicker  {...createInputProps(f)} />)
    } else if (f.monthPicker) {
      return fr(f.id)(<DatePicker.MonthPicker  {...createInputProps(f)} />)
    } else if (f.timePicker) {
      return fr(f.id)(<TimePicker  {...createInputProps(f)} />)
    } else if (f.upload) {
      return fr(f.id)(<FGUpload {...f} />)
    }
    return (
      <div>Input type error</div>
    )
}

function createFormItems (fields, fr, formItemLayout) {
  return fields.map((f) => {
    let itemProps = f.itemProps || {}
    if (f.label) itemProps.label = f.label
    return (
      <FormItem {...itemProps} hasFeedback {...formItemLayout}>
        {createInput(f, fr)}
      </FormItem>
    )
  })
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
    const items = createFormItems(fields, fr, formItemLayout)
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

