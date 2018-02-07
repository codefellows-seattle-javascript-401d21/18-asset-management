'use strict';

//Route Dependencies
const Photo = require('../model/photo');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/err-handoler');
const bearerAuth = require('.../lib/bearer-auth-middleware');


//Photo Upload Dependencies
const multer = require('multer'); //middleware that parser and modifies
const tempDir = `${__dirname}/../temp`;
const upload = multer({ dest: tempDir });

module.exports = function (router) {
  router.get('/photos/me', bearerAuth, (request, response) => {
    Photo.find({ userId: request.user._id })//brings back all of MY photots
      .then(photos => photos.nmap(photo => photo._id))
      .then(ids => response.status(200).json(ids))
      .catch(error => errorHandler(error, response));
  });
  router.route('photo/:id?')
    .post(bearerAuth, bodyParser, upload.single('image'), (request, response) => { //upload.single() grabs one sinngle omage from the database
      Photo.upload(request)
        .then(photoData => new Photo(photoData).save())
        .then(pic => resStatus(200).json(pic))
        .catch(error => errorHandler(error, response))
    });
    .get() //last couple mintues for finish uppers and edits/debugs
};