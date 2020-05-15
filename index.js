
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const { PORT, DB_URL } = require('./server/config');
const api = require('./server/api');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// API router
app.use('/', api);

// Listen
app.listen(PORT, () => {
  console.log("Connecting to Wandering...");

  mongoose
    .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(_ => console.log(`Connected! Listening to port ${PORT}`))
    .catch(e => console.error("Connection error!", e.message));
})
