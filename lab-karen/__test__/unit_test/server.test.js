'use strict';

let server = require('../../lib/server');
require('jest');

describe('Server Module', () => {
  beforeEach(server.start);
  afterEach(server.stop);

  describe('Server start error', () => {
    it('should return a promise rejection when attempting to start a server that is running', () => {
      server.start()
        .catch(err => expect(err.message).toMatch(/server error/i));
    });
  });

  // describe('Server stop error', () => {
  //   it('should return a promise rejection when attempting to stop a server that is stopped', () => {
  //     server.stop()
  //       .then(server.stop())
  //       .catch(err => expect(err.message).toMatch(/server not running/i));
  //   })
  //     ;.then(server.start)
  // });
});
