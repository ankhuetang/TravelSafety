const express = require('express');
const { check } = require('express-validator');
const subscriptionController = require('../controllers/subscription-controllers');

const router = express.Router();

router.post('/subscription', subscriptionController.subscribe);

router.get('/profile', subscriptionController.getSubscription); // Should keep this here?
module.exports = router;
