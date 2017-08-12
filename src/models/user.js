import modelExtend from 'dva-model-extend'
import * as userService from '../requests/user'
import * as usersService from '../requests/users'
import { model } from './common'
import { config } from 'utils'
import showOpsNotification from 'utils/notification'
import { localization } from 'utils'
import _ from 'lodash'

const { prefix } = config

export default modelExtend(model, {
  namespace: 'user',

  state: {
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
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *'multiDelete' ({ payload }, { call, put }) {
      const data = yield call(usersService.remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *create ({ payload }, { call, put }) {
      const data = yield call(userService.create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(userService.update, newUser)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  },
})
