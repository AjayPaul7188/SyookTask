const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: String,
  origin: String,
  destination: String,
  timestamp: Date,
});

module.exports = mongoose.model("Message", messageSchema);