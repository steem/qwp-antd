import * as rqPassport from '../requests/passport'
import * as acls from '../requests/acls'
import * as rqApp from '../requests/app'
import { routerRedux } from 'dva/router'
import { convertFormRules, mergeFormRules } from 'utils/form'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType, SiderBarComponentType } from 'enums'
import { uri, storage, localization } from 'utils'
const { l } = localization
import lodash from 'lodash'
import showOpsNotification from 'utils/notification'
let loadingMenuName = '■■■■■■■■■■'

let app = {
  namespace: 'app',
  state: {
    user: {},
    siderBarComponentType: SiderBarComponentType.MENU,
    menu:[
      {
        id: 1,
        icon: 'laptop',
        name: loadingMenuName,
        path: '/',
      },
      {
        id: 2,
        icon: 'laptop',
        name: loadingMenuName,
        path: '/',
      },
      {
        id: 3,
        icon: 'laptop',
        name: 'user',
        path: '/user',
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
    appSettings: {
      headerNav: [],
    },
    localeChangedTag: 0,
    locationChangedTag: 0,
    inited: false,
  },
  subscriptions: {

    setup ({ dispatch, history }) {
      dispatch({ type: 'init' })
      window.onresize = lodash.debounce(() => {dispatch({ type: 'changeNavbar' })}, 300)
      history.listen(() => { dispatch({type: 'navChanged'}) })
    },

  },
  effects: {

    *init ({
      payload,
    }, { call, put, select }) {
      const appRes = yield call(rqApp.$)
      let appSettings = appRes.success ? appRes.data : yield(select(_ => _.app.appSettings))
      if (appRes.success && appSettings.lang) localization.set(appSettings.lang, put)
      convertFormRules(appSettings)
      const passportRes = yield call(rqPassport.$, payload)
      let isLogined = false, defaultCompnent, menu
      if (appSettings.default) defaultCompnent = appSettings.default
      if (passportRes.success && passportRes.data.user) {
        isLogined = true
        const passportSettings = passportRes.data
        if (passportSettings.lang) localization.set(passportSettings.lang, put)
        convertFormRules(passportSettings)
        mergeFormRules(appSettings, passportSettings)
        if (passportSettings.default) defaultCompnent = passportSettings.default
        if (appSettings.enableHeaderNav) {
          const { headerNav, defaultNav, newAcls } = uri.getHeaderNav(passportSettings.acls, defaultCompnent)
          appSettings.default = defaultNav
          appSettings.headerNav = headerNav
          defaultCompnent = defaultNav
          passportSettings.acls = newAcls
        }
        const { user } = passportSettings
        menu = passportSettings.acls
        let subSystems = []
        yield put({
          type: 'updateState',
          payload: {
            user,
            menu,
            isLogined,
            appSettings,
            subSystems,
            inited: true,
            hasSiderBar: uri.hasSiderBar(menu),
          },
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            isLogined,
          },
        })
      }
      let p = uri.defaultUri(isLogined, defaultCompnent, menu)
      if (p !== false) {
        console.log('to:' + p)
        if (isLogined) {
          yield put(routerRedux.push(p))
        } else if (!uri.isPassportComponent()) {
          window.location = p
        }
      }
    },

    *navChanged ({
      payload,
    }, { call, put, select }) {
      const { menu, inited } = yield(select(_ => _.app))
      if (!inited) return
      let data = {
        locationChangedTag: (new Date()).getTime(),
        hasSiderBar: uri.hasSiderBar(menu),
      }
      yield put({
        type: 'app/updateState',
        payload: data,
      })
    },

    *changePassword({
      payload,
    }, { call, put }) {
      showOpsNotification(yield call(rqPassport.changePassword, payload), 'Change password', 'Password has been changed successfully')
    },

    *logout ({
      payload,
    }, { call, put }) {
      const data = yield call(rqPassport.logout, parse(payload))
      showOpsNotification(data, l('Logout'), l('You are logout'))
      if (data.success) {
        yield put({ type: 'init' })
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

    *changeHeaderNav (state, { payload }) {
      yield put(routerRedux.push(uri.compontent(payload)))
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
