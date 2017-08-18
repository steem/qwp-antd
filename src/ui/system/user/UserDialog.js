import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import { l } from 'utils/localization'
import uri from 'utils/uri'
import layout from 'utils/layout'
import { createOkHander } from 'utils/form'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'

const confirm = Modal.confirm

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
      values:{
        name:'aaa',
      },
      ...this.props,
    }
    return (<HorizontalFormGenerator {...formProps} />)
  }
}

class UserDialog extends React.Component {
  componentDidMount () {

  }

  render () {
    const { 
      appSettings, 
      form,
    } = this.props
    const {
      onOk,
      maxHeight,
      maximized,
      heightIsMaximized,
      ...dialogProps
    } = this.props
    
    const handleOk = createOkHander(form.validateFieldsAndScroll, form.getFieldsValue, onOk)
    const formProps = {
      form,
      appSettings,
      handleOk,
    }

    return (
      <Modal title="Create a new user" {...dialogProps} onOk={handleOk} okText={l('Ok')} cancelText={l('Cancel')}>
        <CreateUserForm {...formProps}/>
      </Modal>
    )
  }
}

UserDialog.propTypes = {
  appSettings: PropTypes.object,
  form: PropTypes.object,
}

export default Form.create()(UserDialog)
