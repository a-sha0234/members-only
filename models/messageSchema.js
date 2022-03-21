const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  name: { type: String },
  messageSubject: { type: String },
  message: { type: String },
});

const messageInfo = mongoose.model("message", messageSchema);
module.exports = messageInfo;
