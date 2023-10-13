const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const Message = require('../models/Message') // Import the Message model

exports.createChatroom = async (req, res) => {
    const { name } = req.body;

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

    const chatroomExists = await Chatroom.findOne({ name });

    if (chatroomExists) throw "Chatroom with that name already exists!";

    const chatroom = new Chatroom({
        name,
    });

    await chatroom.save();

    res.json({
        message: "Chatroom created!",
    });
};

exports.getAllChatrooms = async (req, res) => {
    const chatrooms = await Chatroom.find({});

    res.json(chatrooms);
};

exports.getChatHistory = async (req, res) => {
    const chatroomId = req.params.id;

    try {
        const messages = await Message.find({ chatroom: chatroomId })
            .populate("user", "name")
            .exec();

        res.json(messages); // Return chat messages as JSON
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};
