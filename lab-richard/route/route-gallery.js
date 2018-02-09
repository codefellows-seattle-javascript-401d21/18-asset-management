'use strict';

const Gallery = require('../model/gallery');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = router => {

    router.route('/gallery/:_id?')
        .post(bearerAuthMiddleware, bodyParser, (req, res) => {
            req.body.userID = req.user._id;
            console.log(req.user);

            return new Gallery(req.body).save()
                .then(createdGallery => res.status(201).json(createdGallery))
                .catch(err => errorHandler(err, res));
        })

        .get(bearerAuthMiddleware, (req, res) => {
            if(req.params._id) {
                return Gallery.findById(req.params._id)
                    .then(gallery => res.status(200).json(gallery))
                    .catch(err => errorHandler(err, res));
            }

            return Gallery.find()
                .then(galleries => {
                    let galleriesIDs = galleries.map(gallery => gallery._id);
                    res.status(200).json(galleriesIDs);
                })
                .catch(err => errorHandler(err, res));
        })

        .put(bearerAuthMiddleware, bodyParser, (req, res) => {
            Gallery.findById(req.params._id, req.body)
                .then(gallery => {
                    if(gallery.userID.toString() === req.user._id.toString()){
                        gallery.name = req.body.name || gallery.name;
                        gallery.description = req.body.description || gallery.description;

                        return gallery.save();
                    }

                    return errorHandler(new Error(ERROR_MESSAGE), req);
                })
                .then(() => req.sendStatus(204))
                .catch(err => errorHandler(err, res));
        })

        .delete(bearerAuthMiddleware, (req, res) => {
            return Gallery.findById(req.params._id)
                .then(gallery => {
                    if(gallery.userID.toString() === req.user._id.toString()) {
                        return gallery.remove();
                    } else {
                        return errorHandler(new Error(ERROR_MESSAGE), res);
                    }
                })
                .then(() => res.sendStatus(204))
                .catch(err => errorHandler(err, res));
        });
};