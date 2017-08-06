const Mock = require('mockjs')
let { queryArray, NOTFOUND, orgData } = require('../common')

module.exports = {
  ops: {
    create (req, res) {
      const newData = req.body
      newData.createTime = Mock.mock('@now')
      newData.id = Mock.mock('@id')
      orgData.unshift(newData)
      res.status(200).end()
    },
    del (req, res) {
      const { id } = req.params
      const data = queryArray(orgData, id, 'id')
      if (data) {
        orgData = orgData.filter((item) => item.id !== id)
        res.status(204).end()
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    dels (req, res) {
      const { ids } = req.body
      orgData = orgData.filter((item) => !ids.some(_ => _ === item.id))
      res.status(204).end()
    },
    edit (req, res) {
      const { id } = req.params
      const editItem = req.body
      let isExist = false

      orgData = orgData.map((item) => {
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

      let newData = orgData
      for (let key in other) {
        if ({}.hasOwnProperty.call(other, key)) {
          newData = newData.filter((item) => {
            if ({}.hasOwnProperty.call(item, key)) {
              if (key === 'createTime') {
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
  },
}
