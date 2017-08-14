import { l } from './localization'
import lodash from 'lodash'

let validators = {}
const validatorDesc = {
  digits: 'Must be digits',
  letters: 'Must be letters',
  alphanumeric: 'Must be letters',
  alphanumeric_ex: 'Must be letters',
  url: 'Must be valid url',
  password: 'Password is too simple',
  email: 'Must be valid email',
  number: 'Must be valid number',
  ipv4: 'Must be valid ipv4 address',
  ipv6: 'Must be valid ipv6 address',
  datehour: 'Must be date with hour, eg: 1998-01-01 19:01',
  datetime: 'Must be date with hour and minutes, eg: 1998-01-01 19:01:01',
  date: 'Must be date, eg: 1998-01-01',
  joined_digits: 'Must be digits joined by comma, eg: 1,2,3',
  base64: 'Must be valid base64 encoded value',
  hex: 'Must be hex string',
}

function createMultiRegExValidatorFn() {
  return (rule, value, callback) => {
    let rs = rule.rs
    for (let i = 0, cnt = rs[0].length; i < cnt; ++i) {
      let r
      if (rs[1][i]) r = new RegExp(rs[0][i], rs[1][i])
      else r = new RegExp(rs[0][i])
      if (!r.test(value)) {
        callback(new Error(l('The field is invalid!')))
        return
      }
    }
    callback()
  }
}

function createCompareValidator () {
  return (rule, value, callback) => {
    let rs = rule.rs
    let invalid = false
    value = parseInt(value)
    if (rs[0] === 'min') {
      invalid = rs[1] > value
    } else if (rs[0] === 'max') {
      invalid = rs[1] < value
    } else if (rs[0] === '[]') {
      invalid = value < rs[1][0] || value > rs[1][1]
    } else if (rs[0] === '[)') {
      invalid = value < rs[1][0] || value >= rs[1][1]
    } else if (rs[0] === '(]') {
      invalid = value <= rs[1][0] || value > rs[1][1]
    } else if (rs[0] === '()') {
      invalid = value <= rs[1][0] || value >= rs[1][1]
    }
    if (invalid) callback(new Error(l('The field is invalid!')))
    else callback()
  }
}

function createFileValidator () {
  return (rule, value, callback) => {
    value = value.toLowerCase()
    for (let ext in rule.rs) {
      if (lodash.endsWith(value, `.${ext}`)) {
        callback()
        return
      }
    }
    callback(new Error(l('The field is invalid!')))
  }
}

module.exports = {

  setValidators (v) {
    validators = v
  },

  fieldRuleFn (appSettings, formName, fn) {
    return (name) => {
      let r = {}
      if (appSettings.formRules && appSettings.formRules[formName] && appSettings.formRules[formName][name]) {
        r = appSettings.formRules[formName][name]
      }
      return fn(name, r)
    }
  },

  createOkHander (validateFields, getFieldsValue, onOk, dataKey) {
    return () => {
      let ret = false
      validateFields((errors) => {
        if (errors) {
          return
        }
        ret = true
        if (!dataKey) dataKey = 'f'
        let data = {}
        data[dataKey] = {
          ...getFieldsValue(),
        }
        onOk(data)
      })
      return ret
    }
  },

  convertFormRules (settings) {
    if (!settings.formRules) return
    for (let p in settings.formRules) {
      let f = settings.formRules[p]
      for (let rs in f) {
        let fr = f[rs]
        let nr = { rules: [] }
        let msg = false
        for (let item in fr) {
          let ov = fr[item]
          let r = {}
          if (item === 'file') {
            r.validator = createFileValidator()
            r.rs = ov[0].split(',')
          } else if (item === '_msg') {
            msg = ov
          } else if (item === 'rangelength' || item === '[]') {
            r.min = ov[0]
            r.max = ov[1]
          } else if (item === 'minlength') {
            r.min = ov
          } else if (item === 'maxlength') {
            r.max = ov
          } else if (item === 'min' || item === 'max' || item === 'range' || item === '[)' || item === '(]' || item === '()') {
            r.validator = createCompareValidator()
            r.rs = [item, ov]
          } else if (validators[item]) {
            if (lodash.isArray(validators[item])) {
              r.validator = createMultiRegExValidatorFn()
              r.rs = validators[item]
            } else {
              r = new RegExp(validators[item])
            }
            if (validatorDesc[item]) r.message = l(validatorDesc[item])
          } else {
            r[item] = ov
          }
          nr.rules.push(r)
        }
        if (nr.rules.length > 0) {
          if (msg) {
            nr.rules.map((_) => {
              if (!_.message) _.message = l(msg)
              return _
            })
          }
          f[rs] = nr
        } else {
          delete f[rs]
        }
      }
    }
  },

  mergeFormRules (appSettings, newSettings) {
    if (!newSettings.formRules) return
    if (!appSettings.formRules) appSettings.formRules = newSettings.formRules
    else appSettings.formRules = { ...appSettings.formRules, ...newSettings.formRules }
  },

}
