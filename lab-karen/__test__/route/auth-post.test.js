'use strict';

const server = require('../../lib/server');
const superagent = require('superagent');
const faker = require('faker');
const mocks = require('../lib/mocks');
require('jest');

describe('POST /api/v1/signup', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);

  describe('valid request and response', () => {
    beforeAll(() => {
      this.mockUser = {//create a faker auth object
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send(this.mockUser)
        .then(res => this.res = res)
        .catch(console.log);
    });

    it('should respond with a status of 201 CREATED for a successful post', () => {
      expect(this.res.status).toEqual(201);
    });
    it('should return a valid token', () => {
      let tokenParts = this.res.body.split('.');
      let signature = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
      let token = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

      expect(signature.typ).toEqual('JWT');
      expect(token).toHaveProperty('token');
    });
  });

  describe('Invalid requests', () => {
    it('should return a status 404 NOT FOUND status code for a bad path', () => {
      this.mockUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      return superagent.post(`:${process.env.PORT}/api/v1/NOTFOUND`)
        .send(this.mockUser)
        .catch(err => expect(err.status).toEqual(404));
    });

    it('should return a status 401 NOT AUTHORIZED status code for invalid request', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send({})
        .catch(err => expect(err.status).toEqual(401));
    });

    it('should return a 409 DUPLICATE KEY status when creating a user that already exists', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send(this.mockUser)
        .then(() => {
          return superagent.post(`:${process.env.PORT}/api/v1/signup`)
            .send(this.mockUser);
        })
        .catch(err => expect(err.status).toEqual(409));
    });
  });
});
