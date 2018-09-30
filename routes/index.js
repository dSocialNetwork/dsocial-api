const express = require('express');

const authMiddleware = require('../middlewares/dpayConnectAuth');
const notifications = require('./notifications');

const router = express.Router();

router.use('/notifications', authMiddleware, notifications);

module.exports = router;
