
const slidesController = require('../controllers/slides.controller');
const express = require('express');
const app = express();
const {verifyToken} = require('../middlewares/authenthication');

// Slide Routes
app.get('/get-slides', slidesController.getSlides);
app.post('/create-slide', verifyToken, slidesController.createSlide);
app.put('/edit-slide/:id', verifyToken, slidesController.editSlide);
app.delete('/delete-slide/:id', verifyToken, slidesController.deleteSlide);






module.exports = app;