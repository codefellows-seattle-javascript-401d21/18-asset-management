'use strict';

const errorHandler = require('./error-handler');
const debug = require('debug')('http: basic-auth');
//Custom middleware for basic authentication
module.exports = function(req, res, next) {
  debug('basic-auth')
  //read authorization from headers and error if not there
  let authHeaders = req.headers.authorization;
  if(!authHeaders)
    return errorHandler(new Error('Authorization failed. Headers do not match requirements.'), res);
  //get base64 portion of header or error if not there
  let base64 = authHeaders.split('Basic ')[1];
  if (!base64)
    return errorHandler(new Error('Authorization failed. Username and Password required.'), res);
  //get username and password from buffer
  let [username, password] = Buffer.from(base64,  'base64').toString().split(':');
  req.auth = {username, password};
  //error is no username
  if(!req.auth.username) return errorHandler(new Error('Authorization failed. Username required.'), res);
  //error if no password
  if(!req.auth.password) return errorHandler(new Error('Authorization failed. Password required.'), res);
  //otherwards proceed
  next();

};
