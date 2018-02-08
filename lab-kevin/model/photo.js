'use strict';

const mongoose = require(mongoose);


const Photo = mongoose.Schema({
  image_url: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  description: {type: String, required: true},
  user_id: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'auth'},
  gallery_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'gallery'},
  cloud_key: {type: String, required: true, unique: true},
},
{timestamps: true}
); 



module.exports = mongoose.model('photo', Photo);