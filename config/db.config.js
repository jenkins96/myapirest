const mongoose = require('mongoose');

 const db =    () => {  mongoose.connect('mongodb://localhost:27017/myapirest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {
  if( err ){
    throw err;
  } else{
    console.log("Connected to DB");
  }
})
 };

module.exports = db;