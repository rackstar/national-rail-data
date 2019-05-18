const { describe, it, beforeEach } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
// const sinon = require('sinon')
const expect = require('chai').expect
const RailData = require('../index')

describe('RailData', () => {
  let railData
  let user
  let pass
  beforeEach(() => {
    user = 'testuser'
    pass = 'testpass'
    railData = new RailData(user, pass)
  })

  describe('constructor', () => {
    it('should persist credentials for use in query', () => {
      expect(railData._user).to.equal(user)
      expect(railData._pass).to.equal(pass)
    })
  })
})
