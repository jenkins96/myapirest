const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let slideSchema = new Schema({

  image: {
    type: String,
    required: [true, "The image is mandatory"]
  },
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  }
});


module.exports = mongoose.model("slides", slideSchema);