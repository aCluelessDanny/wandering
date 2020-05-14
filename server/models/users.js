
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true }
}, { timestamps: true });

const usersCollection = mongoose.model('users', userSchema);

router.post('/api/createUser', ({ body }, res) => {
  if (!body) {
    res.statusMessage = "Missing body!"
    res.status(400).end();
  }

  const query = { id: body.id, name: body.display_name };
  const update = { expire: null };
  const options = { upsert: true, new: true };

  usersCollection.findOneAndUpdate(query, update, options)
    .then(createdUser => res.status(201).json(createdUser))
    .catch(err => {
      res.statusMessage = err;
      res.status(500).end();
    })
});

module.exports = router;
