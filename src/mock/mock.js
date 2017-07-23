const mocks = require('./services')
const { lang } = require('./common')
const L = {
  en: require('./services/data/lang/en/global'),
  zh: require('./services/data/lang/zh/global'),
}

function _l (req, res) {
  res.json({
    success: true,
    data: ['/', L[lang]]
  })
}

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
  } else if (!m && op === '_l') {
    fn = _l
  }
  if (fn) fn(req, res)
  else res.status(400).end(JSON.stringify(mocks))
}

module.exports = {

  'POST /mock': mockFns,
  'GET /mock': mockFns,

}
