import { login } from '../requests/passport'
import { routerRedux } from 'dva/router'
import showOpsNotification from 'utils/notification'

export default {
  namespace: 'passport',
  state: {
    loginLoading: false,
  },

  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      data.notice = true
      showOpsNotification(data, 'Login')
      if (data.success) {
        yield put({ type: 'app/init' })
      }
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
  },
}
