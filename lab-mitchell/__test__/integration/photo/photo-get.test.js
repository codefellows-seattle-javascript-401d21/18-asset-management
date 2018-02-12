'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mocks');
const faker = require('faker');
const photo = `${__dirname}/../../lib/dino.jpg`;
const debug = require('debug')('http:photo-get.test');
require('jest');

describe('#photo GET /api/v1/photo', function () {
  beforeAll(server.start);
  beforeAll(() => this.base = `:${process.env.PORT}/api/v1/photo`);
  beforeAll(() => mock.auth.createOne().then(data => this.mockAuth = data));
  // beforeAll(() => mock.gallery.createOne().then(data => this.mockGallery = data));
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  beforeAll(() => {
    return mock.gallery.createOne()
      .then(mock => {
        this.mockGallery = mock;
        return superagent.post(this.base)
          .set('Authorization', `Bearer ${this.mockGallery.token}`)
          .field('name', faker.name.firstName())
          .field('description', faker.lorem.words(5))
          .field('galleryId', `${this.mockGallery.gallery._id}`)
          .attach('image', photo);
      })
      .then(response => {
        console.log(response.body);
        return this.response = response;
      });
  });
  
  describe('valid input/output', () => {
    it('should return status 200 for get all', () => {
      return superagent.get(this.base)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it('should return status 200 for get one', () => {
      return superagent.get(this.base)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
  });

  describe('invalid input/output', () => {
    it('should return status 401 for get all with no token', () => {
      return superagent.get(this.base)
        .set('Authorization', `Bearer `)
        .catch(error => {
          expect(error.status).toBe(401);
        });
    });
    it('should return status 401 for get one with no token', () => {
      return superagent.get(`${this.base}/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer `)
        .catch(error => {
          expect(error.status).toBe(401);
        });
    });
    it('should return status 404 for get one with ID not found', () => {
      return superagent.get(`${this.base}/NOID`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .catch(error => {
          expect(error.status).toBe(404);
        });
    });
  });
});