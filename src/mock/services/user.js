const Mock = require('mockjs')
let { queryArray, NOTFOUND, userData } = require('../common')
const { EnumRoleType, userPermission } = require('./data/passport')
let { adminUsers } = require('./data/passport')

module.exports = {
  ops: {
    get (req, res) {
      const { id } = req.params
      const data = queryArray(userData, id, 'id')
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    create (req, res) {
      const newData = req.body
      newData.createTime = Mock.mock('@now')
      newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))
      newData.id = Mock.mock('@id')

      userData.unshift(newData)

      res.status(200).end()
    },
    del (req, res) {
      const { id } = req.params
      const data = queryArray(userData, id, 'id')
      if (data) {
        userData = userData.filter((item) => item.id !== id)
        res.status(204).end()
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    dels (req, res) {
      const { ids } = req.body
      userData = userData.filter((item) => !ids.some(_ => _ === item.id))
      res.status(204).end()
    },
    edit (req, res) {
      const { id } = req.params
      const editItem = req.body
      let isExist = false

      userData = userData.map((item) => {
        if (item.id === id) {
          isExist = true
          return Object.assign({}, item, editItem)
        }
        return item
      })

      if (isExist) {
        res.status(201).end()
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    list (req, res) {
      const { query } = req
      let { pageSize, page, ...other } = query
      pageSize = pageSize || 10
      page = page || 1

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
      }

      res.status(200).json({
        data: newData.slice((page - 1) * pageSize, page * pageSize),
        total: newData.length,
      })
    },

    pwd (req, res) {
      const editItem = req.body
      let isExist = false

      adminUsers = adminUsers.map((item) => {
        if (item.id === editItem.id) {
          isExist = true
          return Object.assign({}, item, {password: editItem.pwd1})
        }
        return item
      })
      let data = {
        success: isExist
      }
      if (!isExist) data.message = 'Wrong parameters' 
      res.status(200).json(data)
    }
  },
}
