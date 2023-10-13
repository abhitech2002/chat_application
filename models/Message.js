const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Chatroom is required!",
        ref: "Chatroom",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: "Chatroom is required!",
        ref: "User",
    },
    message: {
        type: String,
        required: "Message is required!",
    },
    name: {
        type: String, // Add this field to store the sender's name
        required: "Sender name is required!",
    },
    created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
