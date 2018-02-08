'use strict';

const server = require('../../lib/server');
const debug = require('debug')('http: gallery-post');
const superagent = require('superagent');
const mocks = require('../lib/mocks');
// const faker = require('faker');
require('jest');
debug('gallery-get');

describe('GET /api/v1/gallery', function () {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.gallery.removeAll);

  beforeAll(() => mocks.auth.createOne().then(data => this.mockUser = data)); //create a mock user
  beforeAll(() => mocks.gallery.createOne().then(data => this.mockGallery = data)); //create a mock gallery

  describe('Valid request', () => {
    //send a get without a an id
    it('should return a status 200 for all user galleries', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then(res => {
          expect(res.status).toEqual(200);
        });
    });
    //send a get with an id
    it('should return a status 200 for a gallery with an id', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then(res => {
          expect(res.status).toEqual(200);
        });
    });
  });
  describe('Invalid request', () => {
    //send a bad jsonWebToken
    it('should return a 401 NOT AUTHORIZED with a bad token', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });
    //send a bad path
    it('should return a 404 status for not found', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/noExist`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({})
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});
