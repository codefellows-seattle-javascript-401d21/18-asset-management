'use strict';

const errorHandler = require('./error-handler');
const jsonWebToken = require('jsonwebtoken');
const Auth = require('../model/auth');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function (req, res, next) {

  let auth_headers = req.headers.authorization;
  if (!auth_headers) return errorHandler(ERROR_MESSAGE, res);

  let token = auth_headers.split(/\s/)[1];
  if (!token) return errorHandler(ERROR_MESSAGE, res);

  return jsonWebToken.verify(token, process.env.SECRET, (err, value) => {
    if(err){
      err.message = ERROR_MESSAGE;
      return errorHandler(err, res);
    }

    Auth.findOne({compHash: value.token})
      .then(user => {
        if (!user) return errorHandler(ERROR_MESSAGE, res);
        req.user = user;
        next();
      })
      .catch(err => errorHandler(err, res));
      
  });

};