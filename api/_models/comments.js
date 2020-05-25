
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  trackID: { type: String, required: true },
  comment: { type: String, required: true }
})

module.exports = mongoose.model('comments', commentSchema);
