const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const utilityModel = new Schema({
  icon: {
    type: String
  },
  name: {
    type: String
  },
  deleted_at: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('Utility', utilityModel);