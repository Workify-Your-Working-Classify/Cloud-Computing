const express = require('express');
const { addArticle, getArticle } = require('../controllers/articleController');
const router = express.Router();

// Route untuk menambahkan artikel baru
router.post('/add', addArticle);

router.get('/articles', getArticle); // Route untuk mendapatkan daftar artikel

module.exports = router;
