const { prefix } = require('./config')

module.exports = {
  get (k) {
    return localStorage.getItem(`${prefix}${k}`)
  },
  set (k, v) {
    localStorage.setItem(`${prefix}${k}`, v)
  },
}
