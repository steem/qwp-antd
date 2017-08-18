import modelExtend from 'dva-model-extend'
import * as userService from '../requests/user'
import * as usersService from '../requests/users'
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
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
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

    *'delete' ({ payload }, { call, put, select }) {
      const data = yield call(userService.remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
      } else {
        throw data
      }
    },

    *'multiDelete' ({ payload }, { call, put }) {
      const data = yield call(usersService.remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    *create ({ payload }, { call, put }) {
      const data = yield call(userService.create, payload)
      yield put({
        type: 'updateState',
        payload: {
          _t: (new Date()).getTime(),
        },
      })
      showOpsNotification(data, l('Create user'), l('New user has been created successfully'))
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(userService.update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

  },

  reducers: {

  },
})
