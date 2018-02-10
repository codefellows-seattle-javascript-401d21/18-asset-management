const faker = require('faker')
const mocks = require('../lib/mocks')
const superagent = require('superagent')
const server = require('../../lib/server')
const image = `${__dirname}/../../assets/iceland.jpg`

describe('POST /api/v1/photo', function() {
  beforeAll(server.start)
  beforeAll(() => mocks.auth.createOne().then(data => this.mockUser = data))
  afterAll(server.stop)
  afterAll(mocks.auth.removeAll)
  afterAll(mocks.gallery.removeAll)

  describe('Valid request', () => {
    it('should return a 201 CREATED status code', () => {
      return mocks.gallery.createOne()
        .then(mock => {
          return superagent.post(`:${process.env.PORT}/api/v1/photo`)
            .set('Authorization', `Bearer ${mock.token}`)
            .field('name', faker.name.firstName())
            .field('desc', faker.hacker.ingverb())
            .field('galleryId', `${mock.gallery._id}`)
            .attach('image', image)
        })
        .then(res => {
          expect(res.status).toEqual(201)
          expect(res.body).toHaveProperty('name')
        })
    })
  })

  describe('Invalid request', () => {
    it('should return a 401 unauthorized if bad token', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401))
    })
    it('should return a 400 validation error', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .field('name', faker.name.firstName())
        .field('desc', faker.hacker.ingverb())
        .attach('image', image)
        .catch(err => expect(err.status).toEqual(400))
    })
    it('should return a 500 default error', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .catch(err => expect(err.status).toEqual(500))
    })
  })
})
