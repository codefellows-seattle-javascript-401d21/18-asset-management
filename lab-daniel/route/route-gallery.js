'use strict';

const Gallery = require('../model/gallery');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth-middleware');
const debug = require('debug')('http:route-gallery');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = router => {
  router.route('/gallery/:_id?')
    .post(bearerAuth, bodyParser, (req, res) => {
      req.body.userId = req.user._id;
      debug(`Start POST Gallery >>>>> ${req.body}`);
      return new Gallery(req.body).save()
        .then(gallery => res.status(201).json(gallery))
        .catch(err => errorHandler(err, res));
    })

    .get(bearerAuth, (req, res) => {
      if(req.params._id) {
        return Gallery.findById(req.params._id)
          .then(gallery => res.status(200).json(gallery))
          .catch(err => errorHandler(err, res));

      }

      return Gallery.find()
        .then(galleries => {
          let galleriesIds = galleries.map(gallery => gallery._id);
          res.status(200).json(galleriesIds);
        })
        .catch(err => errorHandler(err, res));

    })

    .put(bearerAuth, bodyParser, (req, res) => {
      if(!req.params._id) return errorHandler(new Error(ERROR_MESSAGE), res);
      Gallery.findById(req.params._id)
        .then(gallery => {
          if(req.user._id.toString() !== gallery.userId.toString()) return errorHandler(new Error(ERROR_MESSAGE), res);
          gallery.set(req.body).save()
            .then(() => res.sendStatus(204))
            .catch(err => errorHandler(err, res));
        });
    })

    .delete(bearerAuth, (req, res) => {
      if (!req.params._id) return errorHandler(new Error(ERROR_MESSAGE), res);
      Gallery.findById(req.params._id)
        .then(gallery => {
          if (req.user._id.toString() !== gallery.userId.toString()) return errorHandler(new Error(ERROR_MESSAGE), res);
          gallery.remove()
            .then(() => res.sendStatus(204))
            .catch(err => errorHandler(err, res));
        });
    });
};