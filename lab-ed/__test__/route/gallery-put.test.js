'use strict'

const mocks = require('../lib/mocks')
const superagent = require('superagent')
const server = require('../../lib/server')

describe('PUT /api/v1/gallery', function () {
  beforeAll(server.start)
  // beforeAll(() => mocks.auth.createOne().then(data => this.mockUser = data))
  beforeAll(() => mocks.gallery.createOne().then(data => this.mockData = data))
  afterAll(server.stop)
  afterAll(mocks.auth.removeAll)
  afterAll(mocks.gallery.removeAll)

  describe('Valid request', () => {
    it('should update an existing record', () => {
      // console.log(this.mockData)
      let updated = {
        name: 'wat?',
        description: 'cDosRun',
      }
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockData.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockData.token}`)
        .send(updated)
        .then(res => expect(res.status).toEqual(204))
    })
  });

  describe('Invalid request', () => {
    it('should return a 401 NOT AUTHORIZED given back token', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401))
    })
  })
})
