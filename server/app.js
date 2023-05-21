const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express(); 

mongoose.connect(
    ''
).then(()=>{
    app.listen(5000);
}).catch(err => {
    console.log(err);
})