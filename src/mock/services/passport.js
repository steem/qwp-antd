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
          default: 'sample',
          headerNav: [{
            name: 'sample',
            icon: 'laptop',
            path: '/sample',
          }, {
            name: 'system',
            icon: 'laptop',
            path: '/system',
          }, {
            name: 'settings',
            icon: 'laptop',
            path: '/settings',
          }],
          formRules: {
            "login": {
              "user": {
                "required": true,
                "alphanumeric": true,
                "rangelength": [3, 32]
              },
              "pwd": {
                "required": true,
                "rangelength": [6, 32],
                "password": true
              },
              "option1": {
                "required": true,
                "rangelength": [2, 3],
              }
            },
            changePassword: {
              pwd1: {
                required: true,
                _msg: 'New password is required',
              },
              pwd2: {
                required: true,
                _msg: 'Password confirmation is required',
              }
            },
          },
          acls: [{
            "name": "dashboard",
            "path": "/dashboard"
          }, {
            "name": "sample",
            "path": "/sample"
          }, {
            "name": "UIElement",
            "icon": "camera-o",
            "path": "/sample/UIElement"
          }, {
            "name": "dataTable",
            icon: 'database',
            "path": "/sample/UIElement/dataTable"
          }, {
            "name": "dropOption",
            icon: 'bars',
            "path": "/sample/UIElement/dropOption"
          }, {
            "name": "editor",
            "path": "/sample/UIElement/editor"
          }, {
            "name": "iconfont",
            icon: 'heart-o',
            "path": "/sample/UIElement/iconfont"
          }, {
            "name": "layer",
            "path": "/sample/UIElement/layer"
          }, {
            "name": "search",
            icon: 'search',
            "path": "/sample/UIElement/search"
          }, {
            "name": "chart",
            icon: 'code-o',
            "path": "/sample/chart"
          }, {
            "name": "areaChart",
            icon: 'area-chart',
            "path": "/sample/chart/areaChart"
          }, {
            "name": "barChart",
            icon: 'bar-chart',
            "path": "/sample/chart/barChart"
          }, {
            "name": "lineChart",
            icon: 'line-chart',
            "path": "/sample/chart/lineChart"
          }, {
            "name": "post",
            icon: 'shopping-cart',
            "path": "/sample/post"
          }, {
            "name": "request",
            icon: 'api',
            "path": "/sample/request"
          }, {
            "name": "system",
            "path": "/system"
          }, {
            "name": "user",
            icon: 'user',
            "path": "/system/user"
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
        user,
        pwd
      } = req.body
      const aUser = adminUsers.filter((item) => item.username === user)
      let result = {
        success: false,
        message: 'Failed to login'
      }
      if (aUser.length > 0 && aUser[0].password === pwd) {
        const now = new Date()
        now.setDate(now.getDate() + 1)
        res.cookie('token', JSON.stringify({
          id: aUser[0].id,
          deadline: now.getTime()
        }), {
          maxAge: 900000,
          httpOnly: true,
        })
        result.success = true
        result.message = 'Login successfully'
      }
      res.json(result)
    },
    logout: function (req, res) {
      res.clearCookie('token')
      res.status(200).end()
    },
  },
}
