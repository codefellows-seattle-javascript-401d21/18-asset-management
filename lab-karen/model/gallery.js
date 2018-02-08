'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('http: gallery');
//set up new model with three properties: name, description and userId
const Gallery = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'auth', //reference auth model
  },
});


module.exports = mongoose.model('gallerie',Gallery);
