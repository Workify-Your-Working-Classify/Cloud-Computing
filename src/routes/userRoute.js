const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, logoutUser, generateToken, addKegiatan } = require('../controllers/userController');

// Rute untuk mendaftarkan pengguna baru
router.post('/register', registerUser);

// Rute untuk login pengguna
router.post('/login', loginUser);

// Rute untuk mendapatkan data pengguna
router.get('/user/:id', getUser);

// Rute untuk logout pengguna
router.post('/logout', logoutUser);

// Rute untuk generate token
router.post('/generate-token', generateToken);

// Rute untuk menambahkan kegiatan ke subkoleksi dalam pengguna
router.post('/user/:uid/kegiatan', addKegiatan);

module.exports = router;
