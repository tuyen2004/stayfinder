const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  id_chat: { type: Number, required: true },
  id_sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  id_receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message_content: { type: String, default: "" },
  post_title: { type: String, default: "" },
  time_send: { type: Date, default: Date.now },
  create_at: { type: Date, default: Date.now },
  sendingStatus: { type: String, default: "Đã gửi" },
  image_url: { type: String, default: "[]" },
  stickers_url: { type: String, require: false },
  isRevoked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
