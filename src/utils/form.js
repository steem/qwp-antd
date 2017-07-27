import { l } from './localization'

module.exports = {
  fieldRuleFn (appSettings, formName, fn) {
    return (name) => {
      let r = {}
      if (appSettings.formRules && appSettings.formRules[formName] && appSettings.formRules[formName][name]) {
        r = appSettings.formRules[formName][name]
      }
      return fn(name, r)
    }
  },

  createOkHander (validateFields, getFieldsValue, onOk) {
    return () => {
      let ret = false
      validateFields((errors) => {
        if (errors) {
          return
        }
        ret = true
        const data = {
          ...getFieldsValue(),
        }
        onOk(data)
      })
      return ret
    }
  },

  convertFormRules (appSettings) {
    if (!appSettings.formRules) return
    for (let p in appSettings.formRules) {
      let f = appSettings.formRules[p]
      for (let rs in f) {
        let nr = {rules: []}, msg = false
        for (let item in f[rs]) {
          let ov = f[rs][item]
          if (item === '_msg') {
            msg = ov
            continue
          }
          let r = {}
          r[item] = ov
          nr.rules.push(r);
        }
        if (nr.rules.length > 0) {
          if (msg) {
            nr.rules.map(_ => {
              _.message = l(msg)
              return _
            })
            f[rs] = nr
          }
        } else {
          delete f[rs]
        }
      }
    }
  },

  mergeFormRules (appSettings, newSettings) {
    if (!newSettings.formRules) return
    if (!appSettings.formRules) appSettings.formRules = newSettings.formRules
    else appSettings.formRules = {...appSettings.formRules, ...newSettings.formRules}
  },
  
}
