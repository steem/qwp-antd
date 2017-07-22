import { notification } from 'antd'

export default (data, title, sucMessage, failedMessage) => {
  let message, type
  if (data && data.success) {
    type = 'success'
    message = sucMessage ? sucMessage : (data.message || 'The operation is succeeded')
  } else {
    type = 'error'
    message = failedMessage ? failedMessage : (data && data.message ? data.message : 'Operation is failed. The error is known')
  }
  if (!title) title = 'Operation notification'
  notification[type]({
    message: title,
    description: message,
  })
}
