'use strict';

const Photo = require('../model/photo');
const bodyParser = require('body-parser');
const bearer_auth_middleware = require('../lib/bear-auth-middleware');
const errorHandler = require('../lib/error-handler');

//upload dependencies
const tempDir = `${__dirname}/../temp`;
const multer = require('multer');
const upload = multer({dest: tempDir})

module.exports = function(router) {

  router.route('/photo/:id')

    .post(bearer_auth_middleware, bodyParser, upload.single('image'), (req, res) => {
      Photo.upload(req)
        .then(data => new Photo(data).save())
        .then(img => res.status(201).json(img))
        .catch(err => errorHandler(err,res));
    });

    


};
