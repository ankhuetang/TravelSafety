const express = require('express');
const { check } = require('express-validator');
const mapController = require('../controllers/map-controllers');

const router = express.Router();

router.post('/data', mapController.getPlaceByAddress);
