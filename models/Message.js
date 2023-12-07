const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  avatar: String,
});

const MessSchema = new mongoose.Schema({
  content: String,
  time: String,
});


const MessageSchema = new mongoose.Schema({
  serverid: String,
  message: {
    type: [MessSchema],
    required: true,
  },
  user: {
    type: [UserSchema],
    required: true,
  },
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
