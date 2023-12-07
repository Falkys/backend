const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: String,
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Post', PostSchema);
