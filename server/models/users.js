
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);
