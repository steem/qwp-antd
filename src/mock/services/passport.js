const qs = require('qs')
const {
  adminUsers
} = require('./data/passport')
const {
  lang,
  inDebug
} = require('../common.js')
const L = {
  en: require('./data/lang/en/passport'),
  zh: require('./data/lang/zh/passport'),
}

module.exports = {
  ops: {
    '$': (req, res) => {
      const cookie = req.headers.cookie || ''
      const cookies = qs.parse(cookie.replace(/\s/g, ''), {
        delimiter: ';'
      })
      const response = {
        success: true,
        data: {
          lang: [
            ['/', L[lang]]
          ],
          default: 'user',
          headerNav: [{
            name: 'sample',
            icon: 'laptop'
          }, {
            name: 'system',
            icon: 'laptop'
          }, {
            name: 'settings',
            icon: 'laptop'
          }],
          formRules: {
            changePassword: {
              pwd1: {
                required: true,
                _msg: 'New password is required',
              },
              pwd2: {
                required: true,
                _msg: 'Password confirmation is required',
              }
            }
          },
          acls: [{
            "name": "sample",
            "path": "/sample"
          }, {
            "name": "UIElement",
            "path": "/sample/UIElement"
          }, {
            "name": "dataTable",
            "path": "/sample/UIElement/dataTable"
          }, {
            "name": "dropOption",
            "path": "/sample/UIElement/dropOption"
          }, {
            "name": "editor",
            "path": "/sample/UIElement/editor"
          }, {
            "name": "iconfont",
            "path": "/sample/UIElement/iconfont"
          }, {
            "name": "layer",
            "path": "/sample/UIElement/layer"
          }, {
            "name": "search",
            "path": "/sample/UIElement/search"
          }, {
            "name": "chart",
            "path": "/sample/chart"
          }, {
            "name": "areaChart",
            "path": "/sample/chart/areaChart"
          }, {
            "name": "barChart",
            "path": "/sample/chart/barChart"
          }, {
            "name": "lineChart",
            "path": "/sample/chart/lineChart"
          }, {
            "name": "dashboard",
            "path": "/sample/dashboard"
          }, {
            "name": "post",
            "path": "/sample/post"
          }, {
            "name": "request",
            "path": "/sample/request"
          }, {
            "name": "system",
            "path": "/system"
          }, {
            "name": "user",
            "path": "/system/user"
          }, {
            "name": "test",
            "path": "/test"
          }]
        }
      }
      let user = null
      if (inDebug() || cookies.token) {
        const token = inDebug() ? true : JSON.parse(cookies.token)
        if (inDebug() || (token && token.deadline > new Date().getTime())) {
          user = {}
          const userId = inDebug() ? 0 : token.id
          const userItem = adminUsers.filter(_ => _.id === userId)
          if (userItem.length > 0) {
            user.permissions = userItem[0].permissions
            user.username = userItem[0].username
            user.id = userItem[0].id
            user.roleName = userItem[0].permissions.roleName
            user.createTime = userItem[0].createTime || (new Date()).toLocaleDateString()
          }
        }
      }
      if (user) response.data.user = user
      res.json(response)
    },
    login(req, res) {
      const {
        username,
        password
      } = req.body
      const user = adminUsers.filter((item) => item.username === username)

      if (user.length > 0 && user[0].password === password) {
        const now = new Date()
        now.setDate(now.getDate() + 1)
        res.cookie('token', JSON.stringify({
          id: user[0].id,
          deadline: now.getTime()
        }), {
          maxAge: 900000,
          httpOnly: true,
        })
        res.json({
          success: true,
          message: 'Ok'
        })
      } else {
        res.status(400).end()
      }
    },
    logout: function (req, res) {
      res.clearCookie('token')
      res.status(200).end()
    },
  },
}
