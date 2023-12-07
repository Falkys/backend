const mongoose = require('mongoose');

const info = new mongoose.Schema({
  name: String,
  id: String,
  createdAt: String,
});

const user = new mongoose.Schema({
  id: String,
});

const MessageSchema = new mongoose.Schema({
  id: String,
  info: {
    type: [info],
    required: true,
  },
  owner: {
    type: [user],
    required: true,
  },
  users: {
    type: [user],
    required: false,
  },
});

const MessageModel = mongoose.model('Guilds', MessageSchema);

module.exports = MessageModel;