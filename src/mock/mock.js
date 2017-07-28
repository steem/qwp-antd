const mocks = require('./services')
const {
  lang
} = require('./common')
const L = {
  en: require('./services/data/lang/en/global'),
  zh: require('./services/data/lang/zh/global'),
}

function appSettings(req, res) {
  res.json({
    success: true,
    data: {
      default: 'portal',
      enableHeaderNav: true,
      lang: [
        ['/', L[lang]]
      ],
      modulesNeedNotLogin: ['portal', 'test'],
      headerNav: [{
        name: 'portal',
        icon: 'laptop',
        path: '/portal',
      }, {
        name: 'test',
        icon: 'laptop',
        path: '/test',
      }],
    }
  })
}

function mockFns(req, res) {
  const {
    m,
    p,
    op
  } = req.query
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
  } else if (!m && op === '$') {
    fn = appSettings
  }
  if (fn) fn(req, res)
  else res.status(400).end(JSON.stringify(mocks))
}

module.exports = {

  'POST /mock': mockFns,
  'GET /mock': mockFns,

}
