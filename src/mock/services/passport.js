const qs = require('qs')
const {
  adminUsers,
} = require('./data/passport')
const {
  lang,
  inDebug,
  P,
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
      let response = {
        success: true,
        data: {
          lang: [
            ['/', L[lang]]
          ],
/*
          后台代码可利用此项来控制header导航条，默认前端自动选择所有一级权限作为headerNav
          headerNav: [{
            name: 'portal',
            icon: 'laptop',
            path: '/portal',
          },{
            name: 'dashboard',
            icon: 'laptop',
            path: '/dashboard',
          },{
            name: 'sample',
            icon: 'laptop',
            path: '/sample',
          }, {
            name: 'system',
            icon: 'laptop',
            path: '/system',
          }],*/
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
// 后端代码可用把权限列表保存在数据库，并设计好排序方式，按顺序输出即可控制模块在前端的显示顺序
          "acls": [{
            "name": "dashboard",
            "path": "/dashboard"
          }, {
            "name": "portal",
            "path": "/portal"
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
          }],
          "default": "sample",
        }
      }
      if (inDebug() || cookies.token) {
        const token = inDebug() ? true : JSON.parse(cookies.token)
        if (inDebug() || (token && token.deadline > new Date().getTime())) {
          response.data.user = {
            "id": 1,
            "username": "Admin",
            "role": 1,
            "roleName": "Admin",
            "createTime": "2017/08/22 16:15:19"
          }
        }
      }
      res.json(response)
    },
    login(req, res) {
      const loginData = P(req, 'f')
      const {
        user,
        pwd
      } = loginData
      let aUser
      if (user === 'admin' && pwd === '123Qwe') {
        aUser = {
          id: 0
        }
      } else {
        aUser = adminUsers.filter((item) => item.username === user && item.password === pwd)
        if (aUser) {
          if (aUser.length > 0) aUser = aUser[0]
          else aUser = false
        }
      }
      let result = {
        success: false,
        message: 'Failed to login'
      }
      if (aUser) {
        const now = new Date()
        now.setDate(now.getDate() + 1)
        res.cookie('token', JSON.stringify({
          id: aUser.id,
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
