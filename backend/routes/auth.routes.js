const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

module.exports = router;
