import { l } from './localization'

export default {
  dialogHelperFns: {
    showModelHandler (e) {
      if (e) e.stopPropagation()
      this.setState({
        visible: true,
      })
    },

    hideModelHandler () {
      this.setState({
        visible: false,
      })
    },

    hideModelHandler () {
      this.setState({
        visible: false,
      })
      if (this.props.cancelHandler) this.props.cancelHandler()
    },

    okHandler () {
      if (!this.props.okHandler || this.props.okHandler()) this.hideModelHandler()
    },
  },
  
  dialogBtns: () => ({
    okText: l('Ok'),
    cancelText: l('Cancel'),
  }),
}
