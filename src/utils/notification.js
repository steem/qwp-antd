import { notification } from 'antd'
import { message } from 'antd'
import { l } from 'utils/localization'

export default (data, title, sucMessage, failedMessage) => {
  let message, type
  if (data && data.success) {
    type = 'success'
    message = sucMessage ? sucMessage : (data.message ? data.message : l('The operation is succeeded'))
  } else {
    type = 'error'
    message = failedMessage ? failedMessage : (data && data.message ? data.message : l('Operation is failed. The error is known'))
  }
  if (!title) title = l('Operation notification')
  if (data.notice) {
    message[type](message)
  } else {
    notification[type]({
      message: title,
      description: message,
    })
  }
}
