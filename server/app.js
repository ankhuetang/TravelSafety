const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express(); 

require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));


mongoose.connect(
  mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }
).then(()=>{
    console.log('MongoDB connected')
    app.listen(8000);
}).catch(err => {
    console.log(err);
})