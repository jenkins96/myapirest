
const galeriesController = require('../controllers/galeries.controller');
const express = require('express');
const app = express();
const {verifyToken} = require('../middlewares/authenthication');


app.get('/get-galeries', galeriesController.getGaleries);
app.post('/create-galery', verifyToken,galeriesController.createGalery);
app.put('/edit-galery/:id', verifyToken, galeriesController.editGalery);
app.delete('/delete-galery/:id', verifyToken, galeriesController.deleteGalery);




module.exports = app;