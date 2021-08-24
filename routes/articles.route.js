
const articlesController = require('../controllers/articles.controller');
const express = require('express');
const app = express();
const {verifyToken} = require('../middlewares/authenthication');


app.get('/get-articles', articlesController.getArticles);
app.post('/create-article', verifyToken,  articlesController.createArticle);
app.put('/edit-article/:id', verifyToken,  articlesController.editArticle);
app.delete('/delete-article/:id', verifyToken,  articlesController.deleteArticle);
// HACER P O S T 




module.exports = app;