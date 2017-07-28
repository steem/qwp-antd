import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'
import { createOkHander } from 'utils/form'
import { l } from 'utils/localization'
import { HorizontalFormGenerator } from 'components/Helper/FormGenerator'
const FormItem = Form.Item
import { dialogHelperFns, dialogBtns } from 'utils/dialogDefault'

const ChangePasswordDialog = React.createClass({
    getInitialState(){ 
      return {
          visible: false
      }
    },
    showChangePassword (e) {
      if (e) e.stopPropagation();
      this.setState({
        visible: true,
      })
      if (this.props.onShowDialog) this.props.onShowDialog()
    },
    render() {
      return (
        <div className={this.props.navClassName}>
          <Button onClick={this.showChangePassword}>{l("Change password")}</Button>
          <Modal
            title={l('Change your password')}
            visible={this.state.visible}
            onOk={this.okHandler}
            onCancel={this.hideModelHandler}
            {...this.props}
          >
            {this.props.children}
          </Modal>
        </div>
      )
    },
    ...dialogHelperFns,
  }
)

const ChangePasswordForm = React.createClass({
    render() {
      const formProps = {
        formName: "changePassword",
        fields: [
          {
            id: "pwd1",
            label: "New password",
            input: "password",
          },{
            id: "pwd2",
            label: "Password confirmation",
            input: "password",
          }
        ],
        ...this.props,
      }
      return (
        <HorizontalFormGenerator {...formProps} />
      )
    },
  }
)

const modal = ({
  onOk,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
  },
  appSettings,
  ...modalProps,
}) => {
  const modalOpts = {
    ...modalProps,
    ...dialogBtns(),
    okHandler: createOkHander(validateFieldsAndScroll, getFieldsValue, onOk),
  }
  const formProps = {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue,
    appSettings,
  }
  return (
    <ChangePasswordDialog {...modalOpts}>
      <ChangePasswordForm {...formProps}/>
    </ChangePasswordDialog>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
  appSettings: PropTypes.object.isRequired,
}

export default Form.create()(modal)
