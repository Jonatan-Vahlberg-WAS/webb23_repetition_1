
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//TODO: add routes here


module.exports = app;