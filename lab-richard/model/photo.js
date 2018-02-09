'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const Gallery = require('./gallery');
const mongoose = require('mongoose');
const tempDir = require(`${__dirname}/../temp`);
const aws3 = require('../lib/aws-s3');


const Photo = mongoose.Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    userid: {type: mongoose.Schema.Types.objectId, ref: 'auth', required: true},
    galleryId: {type: mongoose.Schema.Types.objectId, ref: 'gallery', required: true},
    objectKey: {type: String, required: true, unique: true},
    imageURI: {type: String, required: true, unique: true},
})

Photo.statics.upload = function(req) {
    return new Promise((resolve, reject) => {
        if(!req.file) return reject(new Error('Multi-part form Data Error. File not present on request.'));
        if(!req.file.path) return reject(new Error('Multi-part form Data Error. File path not present on request.'));

        let params = {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET,
            Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
            Body: fs.createReadStream(req.file.path),
        }

        return awsS3.uploadProm(params)
            .then(data => {
                del([`${tempDir}/${req.file.filename}`])

                let photoData = {
                    name: req.body.name,
                    desc: req.body.desc,
                    userId: req.user._id,
                    galleryId: req.body.galleryid,
                    imageURI: data.Location,
                    objectKey: data.Key,
                }
                resolve(photoData);
            })
            .catch(reject);
    });
};

Photo.methods.delete = function() {
    new Promise((resolve, reject) => {
        let params = {
            Bucket: process.env.AWS_BUCKET,
            Key: this.objectKey,
        }

        return awsS3.deleteProm(params)
            .then(() => this.remove())
            .then(resolve)
            .catch(reject);
    });
};

module.exports = mongoose.model('photo', Photo);
