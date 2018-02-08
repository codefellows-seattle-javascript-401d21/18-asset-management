'use strict';

//dependancies
const Auth = require('../model/auth');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const basicAuth = require('../lib/basic-auth-middleware');
const debug = require('debug')('http: route-auth');
//set up post and get routes for authentication
module.exports = function(router) {
  debug('router-auth');
  //POST route for new users
  router.post('/signup', bodyParser, (req, res) => {
    debug('POST');
    //save password locallay and delete from req object
    let pw = req.body.password;
    delete req.body.password;
    //create a new user with Auth schema
    let user = new Auth(req.body);
    //call function to generate password hash
    user.generatePasswordHash(pw)
      .then(newUser => newUser.save())
      .then(userRes => userRes.generateToken())
      .then(token => res.status(201).json(token))
      .catch(err => errorHandler(err, res));
  });
  //GET route for sign-in authenication
  router.get('/signin', basicAuth, (req, res) => {
    debug('GET');
    //call mongoose findOne method to get user info
    Auth.findOne({username: req.auth.username})
      .then(user => {
        return user
        //call function to compare password hashes and reject if user name does not exist
          ? user.comparePasswordHash(req.auth.password)
          : Promise.reject(new Error('Authorization Failed. User not found.'));
      })
      .then(user => {
        //delete authorization and password from req object
        delete req.headers.authorization;
        delete req.auth.password;
        return user;
      })
      //call function to generate JWT
      .then(user => user.generateToken())
      .then(token => res.status(200).json(token))
      .catch(err => errorHandler(err, res));
  });
};
