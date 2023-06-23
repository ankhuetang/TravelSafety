const express = require('express');
const { check } = require('express-validator');
const mapController = require('../controllers/map-controllers');
const subscriptionController = require('../controllers/subscription-controllers');

const router = express.Router();

router.post('/data', mapController.getSearchByAddress);

router.post('/subscription', subscriptionController.subscribe);

router.get('/profile', subscriptionController.getSubscription);

module.exports = router;
