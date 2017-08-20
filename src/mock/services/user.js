const Mock = require('mockjs')
const _ = require('lodash')
const L = {
  en: require('./data/lang/en/user'),
  zh: require('./data/lang/zh/user'),
}
let {
  queryArray,
  NOTFOUND,
  INVALID_PARAMS,
  userData,
  lang,
  P,
} = require('../common')
const {
  EnumRoleType,
  userPermission
} = require('./data/passport')
let {
  adminUsers
} = require('./data/passport')

module.exports = {
  ops: {
    '$': (req, res) => {
      const response = {
        success: true,
        data: {
          lang: [
            ['/system/user', L[lang]],
          ],
          tables: {
            "userList": {
              "names": [
                ["", "", 40, false, "avatar", true],
                ["name", "Name", "10", true, true],
                ["nickName", "NickName", "10", true],
                ["age", "Age", "10", true],
                ["isMale", "", "10", true, true],
                ["phone", "Phone", "20", true],
                ["email", "Email", "20", true],
                ["address", "Address", "22", true],
                ["createTime", "CreateTime", "20"],
                ["", "", "20", false, "operation"]
              ]
            }
          },
          formRules: [
            createUser: {
              name: {
                required: true,
                rangelength: [6, 16],
              },
              nickName: {
                required: true,
                rangelength: [6, 16],
              },
              phone: {
                required: true,
                rangelength: [6, 16],
                digits: true,
              },
              age: {
                required: true,
                digits: true,
              },
              email: {
                required: true,
                email: true,
              },
              address: {
                required: true,
                rangelength: [3, 128],
              },
            }
          ],
        }
      }
    },
    get(req, res) {
      const id = P(req, 'id')
      const data = queryArray(userData, id, 'id')
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    create(req, res) {
      const newData = P(req, 'f')

      if (newData) {
        newData.createTime = Mock.mock('@now')
        newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))
        newData.id = Mock.mock('@id')
        userData.unshift(newData)
        res.status(200).end()
      } else {
        res.status(404).json(INVALID_PARAMS)
      }
    },
    del(req, res) {
      let ids = P(req, 'f')
      if (ids) {
        if (_.isString(ids)) ids = ids.split(',')
        userData = userData.filter((item) => !ids.some(_ => _ === item.id))
      }
      res.status(204).end()
    },
    edit(req, res) {
      const id = P(req, 'id')
      const editItem = P(req, 'f')
      let isExist = false

      if (editItem) {
        userData = userData.map((item) => {
          if (item.id === id) {
            isExist = true
            return Object.assign({}, item, editItem)
          }
          return item
        })
      }
      if (isExist) {
        res.status(201).end()
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    list(req, res) {
      const pageSize = P(req, 'pageSize', 10)
      const page = P(req, 'page', 1)
      const other = P(req, 's')
      const sortField = P(req, 'sortField')
      const sortOrder = P(req, 'sortOrder')

      let newData = userData
      for (let key in other) {
        if ({}.hasOwnProperty.call(other, key)) {
          newData = newData.filter((item) => {
            if ({}.hasOwnProperty.call(item, key)) {
              if (key === 'address') {
                return other[key].every(iitem => item[key].indexOf(iitem) > -1)
              } else if (key === 'createTime') {
                const start = new Date(other[key][0]).getTime()
                const end = new Date(other[key][1]).getTime()
                const now = new Date(item[key]).getTime()

                if (start && end) {
                  return now >= start && now <= end
                }
                return true
              }
              return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
            }
            return true
          })
        }
        if (newData.length > 0 && sortField && !_.isUndefined(newData[0][sortField])) {
          let desc = sortOrder === 'desc' || sortOrder === 'descend'
          newData.sort(function (a, b) {
            if (desc) return a[sortField] > b[sortField]
            return b[sortField] > a[sortField]
          })
        }
      }

      res.status(200).json({
        data: newData.slice((page - 1) * pageSize, page * pageSize),
        total: newData.length,
      })
    },

    pwd(req, res) {
      const editItem = P(req, 'f')
      let isExist = false

      if (editItem) {
        adminUsers = adminUsers.map((item) => {
          if (item.id === editItem.id) {
            isExist = true
            return Object.assign({}, item, {
              password: editItem.pwd1
            })
          }
          return item
        })
      }
      let data = {
        success: isExist
      }
      if (!isExist) data.message = 'Wrong parameters'
      res.status(200).json(data)
    }
  },
}
