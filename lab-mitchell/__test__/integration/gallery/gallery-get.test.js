'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mocks');
// const faker = require('faker');
// const debug = require('debug')('http:auth-get.test');
require('jest');

describe('#gallery GET /api/v1/gallery', function () {
  beforeAll(server.start);
  beforeAll(() => this.base = `:${process.env.PORT}/api/v1/gallery`);
  beforeAll(() => mock.auth.createOne().then(data => this.mockAuth = data));
  beforeAll(() => mock.gallery.createOne().then(data => this.mockGallery= data));
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  describe('valid input/output', () => {
    it('should return status 200 for get all', () => {
      return superagent.get(this.base)
        .set('Authorization', `Bearer ${this.mockAuth.token}`)
        .then(response => {
          expect(response.status).toBe(200);
        });
    });
    it('should return status 200 for get one', () => {
      return superagent.get(`${this.base}/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockAuth.token}`)
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
        .set('Authorization', `Bearer ${this.mockAuth.token}`)
        .catch(error => {
          expect(error.status).toBe(404);
        });
    });
  });
});

