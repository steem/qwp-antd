import { currentUser, logout } from '../requests/passport'
import * as acls from '../requests/acls'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType, SiderBarComponentType } from 'enums'
import { uri, storage } from 'utils'
import lodash from 'lodash'
let loadingMenuName = '■■■■■■■■■■'

let app = {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    siderBarComponentType: SiderBarComponentType.MENU,
    menu:[
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
    siderList:{
      dataUrl:''
    },
    isLogined: false,
    hasHeader: true,
    hasSiderBar: true,
    hasBread: true,
    siderFold: storage.get('siderFold') === 'true',
    darkTheme: storage.get('darkTheme') === 'true',
    isNavbar: document.body.clientWidth < 769,
    subSystems: [],
    error: false,
    notifications: [],
    defaultCompnent: false,
    showPasswordDialog: false,
    navOpenKeys: JSON.parse(storage.get('navOpenKeys')) || [],
  },
  subscriptions: {

    setup ({ dispatch }) {
      dispatch({ type: 'init' })
      window.onresize = lodash.debounce(() => {dispatch({ type: 'changeNavbar' })}, 300)
    },

  },
  effects: {

    *init ({
      payload,
    }, { call, put }) {
      const { success, user } = yield call(currentUser, payload)
      let isLogined = false, defaultCompnent = null
      if (success && user) {
        isLogined = true
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
        let subSystems = []
        if (userAcls.subSystems) subSystems = userAcls.subSystems
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
            isLogined,
            defaultCompnent,
            subSystems,
          },
        })
        defaultCompnent = userAcls.default
      }
      let p = uri.defaultUri(isLogined, defaultCompnent)
      if (p !== false) yield put(routerRedux.push(p))
    },

    *changePassword({
      payload,
    }, { call, put }) {

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

    showChangePassword(state, { payload }) {
      return {
        ...state,
        showPasswordDialog: payload,
      }
    },

    switchSider (state) {
      console.log(state.siderFold)
      storage.set('siderFold', !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      storage.set('darkTheme', !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
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

export default app
