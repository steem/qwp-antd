import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import { l } from 'utils/localization'
import uri from 'utils/uri'
import layout from 'utils/layout'
import { createOkHander } from 'utils/form'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'
import AutoSizeDialog from 'components/Dialog'

class CreateUserForm extends React.Component {
  render() {
    const formProps = {
      formName: 'createUser',
      fields: [{
        id: 'name',
        input: 'text',
        label: l('Name:'),
      }, {
        id: 'nickName',
        input: 'text',
        label: l('Nick name:'),
      }, {
        id: 'phone',
        input: 'text',
        label: l('Phone:'),
      }, {
        id: 'age',
        input: 'text',
        label: l('Age:'),
      }, {
        id: 'email',
        input: 'text',
        label: l('Email:'),
      }, {
        id: 'address',
        input: 'text',
        label: l('Address:'),
      },],
      getFieldDecorator: this.props.form.getFieldDecorator,
      validateFieldsAndScroll: this.props.form.validateFieldsAndScroll,
      getFieldsValue: this.props.form.getFieldsValue,
    }
    return (<HorizontalFormGenerator {...formProps} {...this.props}/>)
  }
}

class UserDialog extends React.Component {
  render () {
    let {
      onOk,
      autoSize,
      formData,
      create,
      appSettings,
      form,
      ...dialogProps,
    } = this.props

    const handleOk = createOkHander(form.validateFieldsAndScroll, form.getFieldsValue, onOk)
    const formProps = {
      form,
      appSettings,
      handleOk,
      values: formData,
    }
    dialogProps.autoSize = 300
    dialogProps.title = create ? l('Create a new user') : l('Edit user information')
    dialogProps.onOk = handleOk
    return (
      <AutoSizeDialog {...dialogProps}>
        <CreateUserForm {...formProps}/>
      </AutoSizeDialog>
    )
  }
}

UserDialog.propTypes = {
  appSettings: PropTypes.object,
  form: PropTypes.object,
}

export default Form.create()(UserDialog)
