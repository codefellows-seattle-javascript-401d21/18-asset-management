'use strict';

const server = require('../../lib/server');
const superagent = require('superagent');
const mocks = require('../lib/mocks');
require('jest');

describe('GET /api/v1/signup', function() {
  let base = `:${process.env.PORT}/api/v1/signin`;
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.user.removeAll);


  describe('signin - valid requst and response', () => {
    beforeAll(() => {
      return mocks.user.createOne()
        .then(data => {
          this.authData = data;
          return superagent.get(base)
            .auth(this.authData.auth.username, data.password)
            .then(res => this.test = res);
        });
    });
  });

  it('test for status - 200 response', () => {
    expect(this.test.status).toBe(200);
  });
  it('401 for no authentication', () => {
    return superagent.get(base)
      .auth('steven', 'greeting')
      .catch(err => {
        expect(err.status).toBe(401);
      });
  });
});
