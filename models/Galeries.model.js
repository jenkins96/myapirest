const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let galeriesSchema = new Schema({

  photo: {
    type: String,
    required: [true, "The photo is mandatory"]
  },

});


module.exports = mongoose.model("galeries", galeriesSchema);