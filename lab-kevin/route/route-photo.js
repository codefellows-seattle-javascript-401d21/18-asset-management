import { upload } from '../lib/aws-sdk';

'use strict';

const Photo = require('../model/photo');
const bodyParser = require('body-parser');
const bearer_auth_middleware = require('../lib/bear-auth-middleware');
const errorHandler = require('../lib/error-handler');

//upload dependencies
const tempDir = `${__dirname}/../temp`;
const multer = require('multer');
const upload = multer({dest: tempDir})

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function(router) {

  router.route('/photo/:id')

    .post(bearer_auth_middleware, bodyParser, (req, res) => {
      if (!req.user)  return new Error(ERROR_MESSAGE);
      if (!req.body) return new Error('Error: Bad request');

    });


};
