
const express = require('express');
const Users = require('./models/users');
const Tracks = require('./models/tracks');

const router = express.Router();

/* Create user info
- POST /api/createrUser */
router.post('/api/createUser', ({ body }, res) => {
  if (!body) {
    res.statusMessage = "Missing body!"
    res.status(400).end();
  }

  const { id, display_name } = body;
  const query = { id };
  const update = { name: display_name };
  const options = { upsert: true };

  Users.updateOne(query, update, options)
    .then(createdUser => res.status(204).json(createdUser))
    .catch(err => {
      res.statusMessage = err;
      res.status(500).end();
    })
});

/* Register track data to user
- POST /api/registerTrack */
router.post('/api/registerTrack', ({ body }, res) => {
  if (!body) {
    res.statusMessage = "Missing body!";
    res.status(400).end();
  }

  const { id, ...rest } = body;
  const query = { id };
  const update = { ...rest };
  const options = { upsert: true };

  Tracks.updateOne(query, update, options)
    .then(createdTrack => res.status(204).json(createdTrack))
    .catch(err => {
      res.statusMessage = err;
      res.status(500).end();
    })
})

module.exports = router;
