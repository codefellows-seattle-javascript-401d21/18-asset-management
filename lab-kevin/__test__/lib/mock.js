'use strict';

const faker = require('faker');
const Auth = require('../../model/auth');
const Gallery= require('../../model/gallery');
const debug = require('debug')('http:mock');

const mock = module.exports = {};

mock.auth = {};
mock.gallery = {};

mock.user = {
  username: `${faker.name.prefix()}${faker.hacker.adjective()}`.replace(/[.\s]/, ''),
  email: `${faker.internet.email()}`,
  password:`${faker.hacker.adjective()}${faker.hacker.noun()}`.replace(/[.\s]/, ''),
};

mock.auth.createUser = () => {
  let auth_data = {};
  auth_data.password = mock.user.password;
  debug('usr and email and paswsword', mock.user.username, mock.user.email, auth_data.password);
  let newUser = Auth({username: mock.user.username, email: mock.user.email});
  return newUser.createHashedpassword(auth_data.password)
    .then(() => newUser.save())
    .then(() => newUser.createToken())
    .then(token =>{
      auth_data.user = newUser;
      auth_data.user_token = token;
      return auth_data;
    })
    .catch(console.err);
};

mock.removeUsers = () => Promise.all([Auth.remove()]); 
mock.removeGalleries = () => Promise.all([Gallery.remove()]); 

mock.gallery.new_gallery_data = () => {
  let newGallery_data = {};
  newGallery_data.title = `${faker.hacker.adjective()} ${faker.random.locale()}`;
  newGallery_data.description = `${faker.company.catchPhraseDescriptor()}`;
  return mock.auth.createUser()
    .then(user_data => {
      //debug('user_data', user_data);
      newGallery_data.user_data = user_data;
      // debug('newGallery', newGallery_data);
      return newGallery_data;
    });
};  

mock.gallery.create_gallery = () => {
  let new_gallery = {};
  return mock.gallery.new_gallery_data()
    .then(gallery_data => {
      debug('newGallery',gallery_data);
      new_gallery.user_data = gallery_data.user_data;
      let gallery_obj = {title: gallery_data.title, description: gallery_data.description, user_id: gallery_data.user_data.user._id};
      return gallery_obj;
    })
    .then(gallery_obj => new Gallery(gallery_obj).save())
    .then(gallery => {
      debug('new_gallery', gallery);
      new_gallery.gallery = gallery;
      debug('new_gallery',new_gallery);
      return new_gallery;
    })
    .catch(console.error);
};
