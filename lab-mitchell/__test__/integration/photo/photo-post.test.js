'use strict';

const server = require('../../../lib/server');
const superagent = require('superagent');
const mock = require('../../lib/mocks');
const faker = require('faker');
const photo = `${__dirname}/../../lib/dino.jpg`;
const debug = require('debug')('http:photo-get.test');
require('jest');

describe('#photo POST /api/v1/gallery', function () {
  beforeAll(server.start);
  beforeAll(() => this.base = `:${process.env.PORT}/api/v1/photo`);
  beforeAll(() => mock.gallery.createOne().then(data => this.mockGallery = data));
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);

  describe('valid input/output', () => {
    it('should', () => {
      return superagent.post(this.base)
        .set('Authorization', `Bearer ${this.mockGallery.token}`)
        .field('name', faker.name.firstName())
        .field('description', faker.lorem.words(5))
        .field('galleryId', `${this.mockGallery.gallery._id}`)
        .attach('image', photo)
        .then(response => {
          expect(response.status).toBe(201);
        });
    });
  });

  describe('invalid input/output', () => {

  });

});