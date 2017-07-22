const mocks = require('./services')

function mockFns (req, res) {
  const { query } = req
  const { m, p, op } = query
  let fn = false

  if (m && mocks[m]) {  
    if (op) {
      if (mocks[m].ops && mocks[m].ops[op]) {
        fn = mocks[m].ops[op]
      } else if (mocks[m].useHome) {
        fn = mocks[m]['/']
      }
    } else if (mocks[m]['/']) {
      fn = mocks[m]['/']
    }
  }
  if (fn) fn(req, res)
  else res.status(400).end(JSON.stringify(mocks))
}

module.exports = {

  'POST /mock': mockFns,
  'GET /mock': mockFns,

}