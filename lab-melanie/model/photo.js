'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const Gallery = require('./gallery');
const mongoose = require('mongoose');
const tempDir = `${__dirname}/../temp`;
const awsS3 = require('../lib/aws-s3');

const Photo = mongoose.Schema({
  name: {type: String, require: true},
  description: {type: String, require: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'auth', required: true},
  galleryId: {type: mongoose.Schema.Types.ObjectId, ref: 'gallery', required: true},
  objectKey: {type: String, required: true, unique: true},
  imageURI: {type: String, required: true, unique: true},
});

Photo.statics.upload = function(req) {
  return new Promise((resolve, reject) => {
    if(!req.file) return reject(new Error('Multi-part Form Data Error'));
    if(!req.file.path) return reject(new Error('Multi-part Form Data Error'));

    let params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
      Body: fs.createReadStream(req.file.path),
    };
    return awsS3.uploadProm(params)
      .then(data => {
        // del([`${tempDir}/*`]);
        let photoData = {
          name: req.body.name,
          desc: req.body.desr,
          galleryId: req.user._id,
          imageURI: data.Location,
          objectKey: data.Key,
        };
        resolve(photoData);
      })
      .catch(reject);
  });
};

// Photo.methods.delete = function() {} // stretch goal

module.exports = mongoose.model('photo', Photo);