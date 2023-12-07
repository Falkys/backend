const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lastUserIdSchema = new Schema({
  name: String,
  lastId: Number,
});

const LastId = mongoose.model('LastId', lastUserIdSchema);

module.exports = LastId;