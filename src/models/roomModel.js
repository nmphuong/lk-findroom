const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomModel = new Schema({
  amount_room:{
    type: Number
  },
  amount_bathroom:{
    type: Number
  },
  amount_bedroom:{
    type: Number
  },
  acreage:{
    type: Number
  },
  title: {
    type: String
  },
  price: {
    type: Number
  },
  type: {
    type: String
  },
  location: {
    type: String
  },
  image: [{
    type: String
  }],
  coordinates: [{
    type: Number
  }],
  description: {
    type: String
  },
  status: {
    type: Boolean,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  utilities: [{
    type: String
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('Room', RoomModel);