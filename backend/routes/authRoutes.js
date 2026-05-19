const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check-session', authController.checkSession);

router.use(authMiddleware);
router.post('/logout', authController.logout);

module.exports = router;