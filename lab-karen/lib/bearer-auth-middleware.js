'use strict';

const errorHandler = require('./error-handler');
const Auth = require('../model/auth');
const jsonWebToken = require('jsonwebtoken');
const debug = require('debug')('http: bearer');
debug('bearer');

const ERROR_MESSAGE = 'Authorization Failed.'; //keep message generic

module.exports = function(request, response, next){
  //get the authorization from the request header
  let authHeader = request.headers.authorization;
  //if it doesn't exist, error
  if(!authHeader)
    return errorHandler(new Error(ERROR_MESSAGE), response);
  //get the jwt value from header by splitting off front
  let token = authHeader.split('Bearer ')[1];
  //if it doesn't exist, error
  if(!token)
    return errorHandler(new Error(ERROR_MESSAGE), response);
  //use the jsonwebtoken verifty method to decrypt the token value

  jsonWebToken.verify(token, process.env.APP_SECRET, (error, decodedValue) => {
    if(error){// if error send message
      error.message = ERROR_MESSAGE;
      return errorHandler(error, response);
    }
    //call db method findOne with token to see if it matched a user
    Auth.findOne({compareHash: decodedValue.token})
      .then(user => {
        if(!user)
          return errorHandler(new Error(ERROR_MESSAGE), response);
        request.user = user;
        next();
      })
      .catch(error => errorHandler(error, response));
  });
};
