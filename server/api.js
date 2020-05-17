
const express = require('express');
const mongoose = require('mongoose');

const Users = require('./models/users');
const Tracks = require('./models/tracks');
const UserTracks = require('./models/userTracks');

const router = express.Router();

/* Get user info
- GET /api/getUser */
router.get('/api/getUser', ({ query }, res) => {
  const { id } = query;

  if (!id) {
    res.statusMessage = "Missing ID!";
    res.status(400).end();
  }

  Users.findOne({ id })
    .then(user => {
      return res.status(200).json(user);
    })
    .catch(err => {
      res.statusMessage = err;
      return res.status(500).end();
    })
});

/* Get music features of each track registered to the user
- GET /api/getTastes */
router.get('/api/getTastes', ({ query }, res) => {
  const { id } = query;

  if (!id) {
    res.statusMessage = "Missing ID!";
    res.status(400).end();
  }

  UserTracks.find({ userID: id })
    .populate('trackID')
    .then(tracks => tracks.map(t => t.trackID.features))
    .then(data => res.status(200).json(data))
    .catch(err => {
      res.statusMessage = err;
      return res.status(500).end();
    })
})

/* Create user info
- POST /api/createrUser */
router.post('/api/createUser', ({ body }, res) => {
  const { id, display_name } = body;

  if (!id || !display_name) {
    res.statusMessage = "Missing body fields!"
    return res.status(400).end();
  }

  Users.updateOne({ id }, { name: display_name }, { upsert: true })
    .then(createdUser => {
      const { upserted } = createdUser;
      return res.status(upserted ? 201 : 202).json(createdUser);
    })
    .catch(err => {
      res.statusMessage = err;
      return res.status(500).end();
    })
});

/* Register track data to user
- POST /api/registerTrack */
router.post('/api/registerTrack', ({ body }, res) => {
  if (!body) {
    res.statusMessage = "Missing body!";
    res.status(400).end();
  }

  const { userID, trackID, ...rest } = body;

  Tracks.findOneAndUpdate({ id: trackID }, { ...rest }, { upsert: true, new: true })
    .then(track => {
      const { _id: trackID } = track;
      return UserTracks.updateOne({ userID, trackID }, {}, { upsert: true });
    })
    .then(data => res.status(201).json(data))
    .catch(err => {
      res.statusMessage = err;
      return res.status(500).end();
    })
})

module.exports = router;
