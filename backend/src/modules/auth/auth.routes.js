const express = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');


const router = express.Router();
const {
    signup,
    login,
    getMe
} = require('./auth.controller');

router.post('/signup', signup);
router.post('/login',login);
router.get('/me', authMiddleware, getMe);


module.exports = router;