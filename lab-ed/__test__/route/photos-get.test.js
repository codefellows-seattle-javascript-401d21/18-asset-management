'use strict'

const server = require('../../lib/server')
const superagent = require('superagent')
const mocks = require('../lib/mocks')
const image = `${__dirname}/../../assets/iceland.jpg`
console.log(image)
require('jest')

describe('GET api/v1/photo', function() {
  beforeAll(server.start)
  beforeAll(() => mocks.auth.createOne().then(data => this.mocksUser = data))
  afterAll(server.stop)

  describe('Invalid request', () => {
    it('should return a 401 unauthorized if bad token', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', 'Bearer foobar')
        .catch(err => expect(err.status).toEqual(401))
    })
    it('should return a 404 bad path', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/photo/imbad`)
        .set('Authorization', `Bearer ${this.mocksUser.token}`)
        .catch(err => expect(err.status).toEqual(404))
    })
  })
})
