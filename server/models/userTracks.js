
const mongoose = require('mongoose');

const userTrackSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  trackID: { type: mongoose.Schema.Types.ObjectId, ref: 'tracks', required: true },
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('userTracks', userTrackSchema);
