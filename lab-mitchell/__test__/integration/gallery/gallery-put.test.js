'use strict';

// const faker = require('faker');
const mock = require('../../lib/mocks');
const superagent = require('superagent');
const server = require('../../../lib/server');
require('jest');

describe('#gallery-put', function() {
  beforeAll(server.start);
  beforeAll(() => this.base = `:${process.env.PORT}/api/v1/gallery`);
  beforeAll(() => mock.gallery.createOne().then(data => this.mockGallery = data));
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  describe('valid input/output', () => {
    let updated = {
      name: 'pajamas',
      description: 'fire trucks',
    };

    it('should update existing record', () => {
      return superagent.put(`${this.base}/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .send(updated)
        .then(response => {
          expect(response.status).toBe(204);
        });
    });
  });

  describe('invalid input/output', () => {
    let updated = {
      name: 'pajamas',
      description: 'fire trucks',
    };

    it('should return 401 with no token', () => {
      return superagent.put(`${this.base}/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer `)
        .send(updated)
        .catch(error => {
          expect(error.status).toBe(401);
        });
    });
    it('should return 400 on bad request', () => {
      return superagent.put(`${this.base}/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .send('string')
        .catch(error => {
          expect(error.status).toBe(400);
        });
    });
    it('should return 404 with no found ID', () => {
      return superagent.put(`${this.base}/NOID`)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .send(updated)
        .catch(error => {
          expect(error.status).toBe(404);
        });
    });
  });
});