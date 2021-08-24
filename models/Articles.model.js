const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let articlesSchema = new Schema({

  cover: {
    type: String,
    required: [true, "The cover is mandatory"]
  },
  title: {
    type: String,
    required: [true, "The title is mandatory"]
  },
  intro: {
    type: String,
    required: [true, "The intro is mandatory"]
  },
  url: {
    type: String,
    required: [true, "The url is mandatory"]
  },
  content: {
    type: String,
    required: [true, "The content is mandatory"]
  }
});


module.exports = mongoose.model("articles", articlesSchema);