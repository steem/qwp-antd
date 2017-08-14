
const _ = require('lodash')
var expect = require('expect')

describe('lodash', () => {
  it('omit equal', () => {
    let obj = {pageSize: 1, page: 2, test: 'aaa',}
    expect.assert(_.pick(obj, 'pageSize'), {pageSize: 1})
    expect.assert(_.omit(obj, ['pageSize', 'page']), {test: 'aaa'})
  })
});
