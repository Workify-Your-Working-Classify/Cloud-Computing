const express = require('express');
const router = express.Router();
const { processRequest } = require('../controllers/modelController');
const authenticate = require('../middleware/auth');

router.post('/run-model', authenticate, processRequest);

module.exports = router;
