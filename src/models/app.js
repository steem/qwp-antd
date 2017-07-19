import { currentUser, logout } from '../services/passport'
import * as acls from '../services/acls'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
const { prefix } = config
import uri from '../utils/uri'
let loadingMenuName = '■■■■■■■■■■'

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: loadingMenuName,
        router: '/',
      },
      {
        id: 2,
        icon: 'laptop',
        name: loadingMenuName,
        router: '/',
      },
      {
        id: 3,
        icon: 'laptop',
        name: 'user',
        router: '/user',
      }
    ],
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {

    setup ({ dispatch }) {
      dispatch({ type: 'init' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    *init ({
      payload,
    }, { call, put }) {
      const { success, user } = yield call(currentUser, payload)
      let logined = false, defaultCompnent = null
      if (success && user) {
        logined = true
        const userAcls = yield call(acls.query)
        const { permissions } = user
        let menu = userAcls.list
        if (permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER) {
          permissions.visit = userAcls.list.map(item => item.id)
        } else {
          menu = userAcls.list.filter(item => {
            return permissions.visit.includes(item.id) && 
              (item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true) &&
              (item.bpid ? permissions.visit.includes(item.bpid) : true)
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
          },
        })
        defaultCompnent = userAcls.default
      }
      let p = uri.defaultUri(logined, defaultCompnent)
      if (p !== false) yield put(routerRedux.push(p))
    },

    *logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({ type: 'init' })
      } else {
        throw (data)
      }
    },

    *changeNavbar ({
      payload,
    }, { put, select }) {
      const { app } = yield(select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    updateError (state, { payload }) {
      return {
        ...state,
        error: payload,
      }
    },

    modelLoaded(state, { payload }) {
      return {
        ...state,
        models: {
          ...state.models,
          ...payload,
        },
      }
    },

  },
}
