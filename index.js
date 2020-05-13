
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { PORT } = require('./server/config');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'client/build')));

// Listen
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
