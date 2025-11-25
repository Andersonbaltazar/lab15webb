const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verificarToken, authController.getCurrentUser);

module.exports = router;
