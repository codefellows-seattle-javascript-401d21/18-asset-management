'use strict';


const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');






describe('GET api/v1/gallery', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.user.removeAll);
  afterAll(mocks.gallery.removeAll);
  beforeAll(() => mocks.user.createOne().then(data => this.mockUser = data));
  beforeAll(() => mocks.gallery.createOne().then(data => this.mockGallery = data));


  describe('test for valid get request', () => {
    it('get for everything should return all of the users galleries', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then(res => {
          expect(res.status).toEqual(200);
        });
    });
    it('test to return should return a single gallery with an id', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then(res => {
          expect(res.status).toEqual(200);
        });
    });
  });
  describe('Invalid request', () => {
    it('return a 401 NOT AUTHORIZED given back token', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer badtoken')
        .catch(err => expect(err.status).toEqual(401));
    });
    it('bad id return 404', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/bad-id-gall`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({})
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});
