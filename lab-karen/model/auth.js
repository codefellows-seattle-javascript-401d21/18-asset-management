'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const debug = require('debug')('http: auth');

//set up account authorization schema for database
const Auth = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  compareHash: {type: String, unique: true},
}, {timestamps: true});

//Define prototype-like methods
//to generate a password hash during sign-up
Auth.methods.generatePasswordHash = function(password) {
  debug('generatePWH');
  if (!password) return Promise.reject(new Error('Authorization failed. Password required.'));
  return bcrypt.hash(password, 10)
    .then(hash => this.password = hash)
    .then(() => this)
    .catch(err => err);
};
//to compare the password hash for sign-in
Auth.methods.comparePasswordHash = function(password) {
  debug('comparePWH');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject (new Error('Authorization failed. Password invalid.'));
      resolve(this);
    });
  });
};
//use Node.js crypto functionality to a compareHash
Auth.methods.generateCompareHash = function () {
  debug('generateCH');
  this.compareHash = crypto.randomBytes(32).toString('hex');
  return this.save()
    .then(() => Promise.resolve(this.compareHash))
    .catch(() => this.generateCompareHash());
};
//to generate a json web token
Auth.methods.generateToken = function() {
  debug('generate token');
  return this.generateCompareHash()
    .then(compareHash => jwt.sign({token: compareHash}, process.env.APP_SECRET))
    .catch(err => err);
};

module.exports = mongoose.model('auth', Auth);
