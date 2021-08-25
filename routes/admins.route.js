
const adminsController = require('../controllers/admins.controller');
const express = require('express');
const app = express();
const {verifyToken} = require('../middlewares/authenthication');


app.get('/get-admins', verifyToken, adminsController.getAdmins);
app.post('/create-admin',   adminsController.createAdmin);
app.put('/edit-admin/:id', verifyToken, adminsController.editAdmin);
app.delete('/delete-admin/:id', verifyToken, adminsController.deleteAdmin);
app.post('/login', adminsController.login);





module.exports = app;