import modelExtend from 'dva-model-extend'
import * as rqPassport from '../requests/passport'
import * as rqApp from '../requests/app'
import { routerRedux } from 'dva/router'
import { convertFormRules, mergeFormRules, setValidators } from 'utils/form'
import { model } from './common'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType, SiderBarComponentType } from 'enums'
import { uri, storage, localization } from 'utils'
const { l } = localization
import lodash from 'lodash'
import showOpsNotification from 'utils/notification'

function footerVisibility() {
  let arr = location.pathname.split('/')
  return arr.length === 1 || arr[1] === 'portal' || arr[1] === 'dashboard'
}

let app = modelExtend(model, {
  namespace: 'app',
  state: {
    user: {
      isLogined: false
    },
    siderBarComponentType: SiderBarComponentType.MENU,
    menu:[],
    siderList:{
      dataUrl:''
    },
    hasHeader: true,
    hasSiderBar: false,
    hasBread: true,
    siderFold: storage.get('siderFold') === 'true',
    darkTheme: storage.get('darkTheme') === 'true',
    isNavbar: document.body.clientWidth < 769,
    subSystems: [],
    error: false,
    notifications: [],
    appSettings: {
      headerNav: [],
      modulesNeedNotLogin: [],
    },
    localeChangedTag: 0,
    locationChangedTag: 0,
    inited: false,
    showFooter: false,
  },
  subscriptions: {

    setup ({ dispatch, history }) {
      dispatch({ type: 'init' })
      window.onresize = lodash.debounce(() => {dispatch({ type: 'sizeChanged' })}, 300)
      history.listen(() => { dispatch({type: 'navChanged'}) })
    },

  },
  effects: {

    *init ({
      payload,
    }, { call, put, select }) {
      const oldSettings = yield(select(_ => _.app.appSettings))
      const appRes = yield call(rqApp.$)
      let appSettings = appRes.success ? appRes.data : oldSettings
      if (!appSettings.headerNav) appSettings.headerNav = []
      if (appRes.success && appSettings.lang) localization.set(appSettings.lang, put)
      if (appSettings.validators) setValidators(appSettings.validators)
      convertFormRules(appSettings)
      const passportRes = yield call(rqPassport.$, payload)
      let isLogined = false, defaultCompnent, menu
      if (appSettings.default) defaultCompnent = appSettings.default
      if (passportRes.success && passportRes.data.user) {
        isLogined = true
        let passportSettings = passportRes.data
        if (passportSettings.lang) localization.set(passportSettings.lang, put)
        convertFormRules(passportSettings)
        mergeFormRules(appSettings, passportSettings)
        if (passportSettings.default) defaultCompnent = passportSettings.default
        if (appSettings.enableHeaderNav) {
          const { headerNav, defaultNav, newAcls } = uri.getHeaderNav(passportSettings.acls, defaultCompnent)
          appSettings.default = defaultNav
          if (passportSettings.headerNav) appSettings.headerNav = passportSettings.headerNav
          else appSettings.headerNav = headerNav
          defaultCompnent = defaultNav
          passportSettings.acls = newAcls
        }
        let { user } = passportSettings
        user.isLogined = isLogined
        menu = passportSettings.acls
        let subSystems = passportSettings.subSystems || []
        yield put({
          type: 'updateState',
          payload: {
            user,
            menu,
            appSettings,
            subSystems,
            inited: true,
            hasSiderBar: uri.hasSiderBar(menu),
            showFooter: footerVisibility(),
          },
        })
      } else {
        if (passportRes.data) {
          convertFormRules(passportRes.data)
          mergeFormRules(appSettings, passportRes.data)
        }
        let state = {
          appSettings,
          user: {
            isLogined
          },
          error: !(appRes.success && passportRes.success),
          showFooter: footerVisibility(),
        }
        if (state.error) state.hasHeader = false
        yield put({
          type: 'updateState',
          payload: state,
        })
      }
      let p = uri.defaultUri(isLogined, defaultCompnent, menu, appSettings.modulesNeedNotLogin)
      console.log('to:' + p + '. is login: ' + isLogined)
      if (p !== false) {
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
        showFooter: footerVisibility(),
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

    *sizeChanged ({
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
})

export default app
