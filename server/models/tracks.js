
const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  album: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  artists: [{
    id: { type: String, required: true },
    name: { type: String, required: true }
  }],
  popularity: { type: Number, required: true },
  features: {
    acousticness: { type: Number, required: true },
    danceability: { type: Number, required: true },
    energy: { type: Number, required: true },
    instrumentalness: { type: Number, required: true },
    liveness: { type: Number, required: true },
    loudness: { type: Number, required: true },
    speechiness: { type: Number, required: true },
    tempo: { type: Number, required: true },
    valence: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('tracks', trackSchema);
