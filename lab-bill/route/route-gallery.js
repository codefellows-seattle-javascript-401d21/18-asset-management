'use strict';

const Gallery = require('../model/gallery');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');


module.exports = router => {
  
  router.route('/gallery/:id?')
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {

      request.body.userId = request.user._id;
      //   console.log(request.body);
      return new Gallery(request.body).save()
        .then(createdGallery => response.status(201).json(createdGallery))
        .catch(error => errorHandler(error,response));
    })

    .get(bearerAuthMiddleware,(request,response) => {
      if(request.params._id){
        return Gallery.findById(request.params._id)
          .then(gallery => response.status(200).json(gallery))
          .catch(error => errorHandler(error,response));
      }

      return Gallery.find()
        .then(galleries => {
          let galleriesIds = galleries.map(gallery => gallery._id);

          response.status(200).json(galleriesIds);
        })
        .catch(error => errorHandler(error,response));
    })
    .put(bearerAuthMiddleware,bodyParser,(req,res) => {
      return Gallery.findByIdAndUpdate(req.params._id, req.body, {upsert: true, runValidators: true})
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    })
    .delete(bearerAuthMiddleware,(req, res) => {
      if (!req.params.id) errorHandler(new Error('Validation Error: ID is required to find the record you wish to delete'), res);
      Gallery.findById(req.params.id)
        .then(gallery => gallery.remove())
        .then(() => res.sendStatus(204))
        .catch(err => errorHandler(err, res));
    });
};