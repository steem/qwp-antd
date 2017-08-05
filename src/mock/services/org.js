const Mock = require('mockjs')
const { queryArray, NOTFOUND } = require('../common')

let orgListData = Mock.mock({
  'data|80-100': [
    {
      id: '@id',
      name: '@name',
      createTime: '@datetime',
    },
  ],
})

let database = orgListData.data

module.exports = {
  ops: {
    create (req, res) {
      const newData = req.body
      newData.createTime = Mock.mock('@now')
      newData.id = Mock.mock('@id')
      database.unshift(newData)
      res.status(200).end()
    },
    del (req, res) {
      const { id } = req.params
      const data = queryArray(database, id, 'id')
      if (data) {
        database = database.filter((item) => item.id !== id)
        res.status(204).end()
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    dels (req, res) {
      const { ids } = req.body
      database = database.filter((item) => !ids.some(_ => _ === item.id))
      res.status(204).end()
    },
    edit (req, res) {
      const { id } = req.params
      const editItem = req.body
      let isExist = false

      database = database.map((item) => {
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

      let newData = database
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
