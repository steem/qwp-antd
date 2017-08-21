import modelExtend from 'dva-model-extend'
import * as userService from 'requests/user'
import { model } from './common'
import { config } from 'utils'
import showOpsNotification from 'utils/notification'
import { localization } from 'utils'
import _ from 'lodash'
const { l } = localization
import { convertFormRules } from 'utils/form'

const { prefix } = config

export default modelExtend(model, {
  namespace: 'user',

  state: {
    _t: 0,
    lastCreateUserData: 0,
    selectedOrgKeys: [],
    selectedUserKeys: [],
    moduleSettings: {
      tables: {},
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      dispatch({
        type: 'init',
        payload: location.query,
      })
    },
  },

  effects: {

    *init ({ payload = {} }, { call, put }) {
      const appRes = yield call(userService.$)
      if (appRes.success && appRes.data) {
        const { lang, ...moduleSettings } = appRes.data
        convertFormRules(moduleSettings)
        if (lang) localization.set(lang, put)
        yield put({
          type: 'updateState',
          payload: {
            moduleSettings,
          },
        })
      } else {
        showOpsNotification(appRes)
      }
    },

    *onEnter ({ payload = {} }, { call, put }) {

    },

    *'delete' ({ payload }, { call, put }) {
      const data = yield call(userService.remove, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            _t: (new Date()).getTime(),
          },
        })
      }
      showOpsNotification(data, l('Delete users'), l('Users are deleted successfully'))
    },

    *create ({ payload }, { call, put }) {
      const data = yield call(userService.create, payload)
      let state = {
        lastCreateUserData: data.success ? 0 : payload.f,
      }
      if (data.success) {
        state._t = (new Date()).getTime()
      }
      yield put({
        type: 'updateState',
        payload: state,
      })
      showOpsNotification(data, l('Create user'), l('New user has been created successfully'))
    },

    *update ({ payload }, { select, call, put }) {
      const data = yield call(userService.update, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            _t: (new Date()).getTime(),
          },
        })
      }
      showOpsNotification(data, l('Edit user information'), l('User information is updated successfully'))
    },

  },

  reducers: {

  },
})
