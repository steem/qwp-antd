
const { l, set } = require('../utils/localization')
const _ = require('lodash')
var expect = require('chai').expect
global.window = {
  location: {
    pathname: '/',
  }
}

describe('lodash', () => {
  it('omit equal', () => {
    let obj = {pageSize: 1, page: 2, test: 'test',}
    expect(_.pick(obj, 'pageSize')).to.eql({pageSize: 1})
    expect(_.omit(obj, ['pageSize', 'page'])).to.eql({test: 'test'})
  })
})

describe('localization', () => {
  it('equal', () => {
    set([['/', {test:'Test'}]])
    expect(l('test')).to.equal('Test')
    set([['/', {test:'Test test'}]])
    expect(l('test')).to.equal('Test test')
    set([['/', {test:'Test'}]])
    set([['/test', {test:'Test another'}]], ({ type, payload }) => {
      expect(type).to.equal('app/updateState')
      expect(payload).to.have.own.property('localeChangedTag')
      expect(payload.localeChangedTag).to.be.an('number')
    })
    global.window.location.pathname = '/test'
    expect(l('test')).to.equal('Test another')
  })

  it('test paths', () => {
    set([['/', {test:'Test'}]])
    global.window.location.pathname = '/notexist'
    expect(l('test')).to.equal('Test')
    expect(l('notexist')).to.equal('notexist')
    global.window.location.pathname = ''
    expect(l('test')).to.equal('Test')
    global.window.location.pathname = '/'
    set([['/passport', {test:'Test {0}'}]])
    expect(l('test', '0')).to.equal('Test 0')
    set([['/', {test:'Test {a}'}]])
    expect(l('test', {a: '0'})).to.equal('Test 0')
  })

  it('not set', () => {
    expect(l('not set {0}', '0')).to.equal('not set 0')
    expect(l('not set {a}', {a: '0'})).to.equal('not set 0')
  })
})
