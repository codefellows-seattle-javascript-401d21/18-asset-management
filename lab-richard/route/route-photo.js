'use strict';

//Route dependencies
const Photo = require('../model/photo');
const bodyParser = require('body-parser');
const errorHandler = require('../lib/error-handler');
const bearerAuth = require('../lib/bearer-auth-middleware');



//Photo upload depenencies
const multer = require('multer');
const tempDir = `${__dirname}/../temp`;
const upload = multer({dest: tempDir});



//Setup
module.exports = function(router) {
    
    router.get('/photos/me', bearerAuth, (req, res) => {
        Photo.find({userId: req.user._id})
            .then(photos => photos.map(photo => photo.id))
            .then(ids => res.status(200).json(ids))
            .catch(err => errorHandler(err, res));
    });

    router.route('/photo/:id?')
    .post(bearerAuth, bodyParser, upload.single('image'), (req, res) => {
        Photo.upload(req)
            .then(photoData => new Photo(photoData).save())
            .then(pic => res.status(201).json(pic))
            .catch(err => errorHandler(err, res))
    })

    .get(bearerAuth, (req, res) => {
        if(req.params.id) {
            return Photo.findById(req.params._id)
                .then(pic => res.status(200).json(pic))
                .catch(err => errorHandler(req, res));
        }

        Photo.find()
            .then(photos => photos.map(photo => photo._id))
            .then(ids => res.status(200).json(ids))
            .catch(err => errorHandler(req, res));
    })

    .put(bearerAuth, bodyParser, (req, res) => {

    })

    .delete(bearerAuth, (req, res) => {
        Photo.findOne({userID: req.user._id, _id: req.params._id})
            .then(pic => {
                return pic
                ? pic.delete()
                : Promise.reject(new Error('Path Error. Photo not found.'))
            })
            .then(() => res.sendStatus(204))
            .catch(err => errorHandler(err, res));
    });

};
