const { adminUsers } = require('./data/passport')

module.exports = {
  ops: {
    login: function (req, res) {
      const { username, password } = req.body
      const user = adminUsers.filter((item) => item.username === username)

      if (user.length > 0 && user[0].password === password) {
        const now = new Date()
        now.setDate(now.getDate() + 1)
        res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
          maxAge: 900000,
          httpOnly: true,
        })
        res.json({ success: true, message: 'Ok' })
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
