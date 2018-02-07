//sign in to aws services by first clicking signup
//top right corner use us west(oregon) in the dropdown menu
//click compute and then EC2
//EC2 More robust deployment platform than Heroku
//Storage S3 is simple storage
//Database: Dynamo DB Like mongo\Rlational DataBAse more like SQL
//SECURITY: IAM creates users and permission

'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const uploads = module.exports = {};

uploads.uploadProm = function (params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => err ? reject(err) : resolve(data));
  });
};
