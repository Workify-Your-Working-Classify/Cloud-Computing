const express = require('express');
const { addArticle } = require('../controllers/articleController');
const router = express.Router();

// Route untuk menambahkan artikel baru
router.post('/add', addArticle);

module.exports = router;
