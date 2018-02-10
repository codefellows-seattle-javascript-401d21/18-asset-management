'use strict'

const faker = require('faker')
const server = require('../../lib/server')
const superagent = require('superagent')
const mocks = require('../lib/mocks')
const image = `${__dirname}/../../assets/iceland.jpg`

describe('GET api/v1/photo', function() {
  beforeAll(server.start)
  beforeAll(() => mocks.auth.createOne().then(data => this.mocksUser = data))
  afterAll(server.stop)

  describe('Valid request', () => {
    it('should return a valid get', () => {
      return mocks.gallery.createOne()
        .then(mock => {
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
              return superagent.get(`:${process.env.PORT}/api/v1/photo/${res.body._id}`)
                .set('Authorization', `Bearer ${mock.token}`)
                .then(res => {
                  expect(res.status).toEqual(200)
                  expect(res.body.name).toEqual(res.body.name)
                  expect(res.body.description).toEqual(res.body.description)
                })
            })
        })
    })
  })

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
