
const express = require('express');

const app = express();


// allow the app to accept JSON and URL encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//TODO: add routes here


module.exports = app;