
const express = require('express');
const cors = require('cors');

const authorRouter = require('./routes/authors');

const app = express();


// allow the app to accept JSON and URL encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// allow the app to accept requests from the frontend
app.use(cors({
    origin: 'http://localhost:5500'
}));


app.use('/api/v1/authors', authorRouter);
//TODO: add book routes here


module.exports = app;