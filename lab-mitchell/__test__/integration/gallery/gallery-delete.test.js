'use strict';

const mock = require('../../lib/mocks');
const superagent = require('superagent');
const server = require('../../../lib/server');
require('jest');

describe('#gallery POST api/v1/gallery', function() {
  beforeAll(server.start);
  beforeAll(() => this.base = `:${process.env.PORT}/api/v1/gallery`);
  beforeAll(() => mock.gallery.createOne().then(data => this.mockGallery = data));
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  describe('Valid input/output', () => {
    it('should have a status 204 with valid request', () => {
      return superagent.delete(`${this.base}/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .then(response => {
          expect(response.status).toBe(204);
        });
    });
  });

  describe('Invalid input/output', () => {
    it('should return 401 not-auth without token', () => {
      return superagent.delete(`${this.base}/${this.mockGallery.gallery._id}`)
        .catch(err => expect(err.status).toBe(401));
    });
    it('should return a 404 on valid request if can`t find ID', () => {
      return superagent.delete(`${this.base}/CANTFINDID`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .catch(error => {
          expect(error.status).toBe(404);
        });
    });
  });
});