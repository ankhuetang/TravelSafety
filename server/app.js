require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mapRoutes = require('./routes/map-routes');
const userRoutes = require('./routes/users-routes');
const { sendSMS } = require('./util/sms');

const { scheduleScrape } = require('../server/util/webscraping/scheduleScrape');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// app.use((req, res, next) => {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept, Authoriztion'
// 	);
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

// 	next();
// });

app.use('/api/map', mapRoutes);
app.use('/api/user', userRoutes);

const mongoURI = process.env.MONGO_URI;

mongoose
	.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(8000);
		console.log('connected to DB');
		sendSMS();
		scheduleScrape();
	})
	.catch((err) => {
		console.log(err);
	});
