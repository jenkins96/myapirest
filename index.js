// DEPENDENCIES
const express = require('express');
const app = express();
const config = require('./config/config');
const mongoose = require('mongoose');
const slidesRoutes = require("./routes/slides.route");
const articlesRoutes = require("./routes/articles.route");
const galeriesRoutes = require("./routes/galeries.route");
const adminsRoutes = require("./routes/admins.route");
const fileUpload = require('express-fileupload');
//const bodyParser = require('body-parser')


// Parsing ( Need it ?)
app.use(express.json({ limit: '10mb',extended: true })); 
app.use(express.urlencoded({ limit: '10mb',extended: true })); 

app.use(fileUpload());

// Middleware for body parser These are deprecated
//app.use(bodyParser.urlencoded({extended: false }));
//app.use(bodyParser.json());




// R O U T E S

app.use("/slides", slidesRoutes);
app.use("/articles", articlesRoutes);
app.use("/galeries", galeriesRoutes);
app.use("/admins", adminsRoutes);

// D A T A B A S E
mongoose.connect('mongodb://localhost:27017/myapirest', {
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
});

app.listen(config.PORT, _ => {
  console.log(`Server listening on port: ${ config.PORT }`);
})