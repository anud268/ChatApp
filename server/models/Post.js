const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: "String",
    default: "true",
  },
});

module.exports = mongoose.model("Post", PostSchema);
