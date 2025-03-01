import chatSchema from "../../modules/chat/chatSchema.js";
import mongoose from "mongoose";
import getUserDetails from "../../utils/getUserDetails.js";
import { io, connections } from "../../websocket/socket.js";

const sendChat = async (req, res) => {
  try {
    const { recipient, message, type } = req.body;
    const token = req.headers.authorization;
    const user = await getUserDetails(token);
    
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    if (!message) {
      return res.status(400).json({ status: 400, message: "Message is required" });
    }

    const recObjectId = new mongoose.Types.ObjectId(recipient);
    const new_chat = new chatSchema({
      user: user._id,
      recipient: recObjectId,
      message,
      type: type || "text",
      isRead: false,
    });

    const chatCreate = await new_chat.save();
    if (!chatCreate) {
      return res.status(400).json({
        status: 400,
        message: "Failed to create chat",
      });
    }

    const recipientSocketId = connections.get(recipient);
    console.log("recipientSocketId", recipientSocketId)
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("new_message", {
        chat: chatCreate,
        sender: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }

    res.status(200).json({
      status: 200,
      message: "Chat sent successfully",
      chat: chatCreate,
    });
  } catch (error) {
    console.error("Error in sendChat:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

const GetChats = async (req, res) => {
  try {
    const user = await getUserDetails(req.headers.authorization);
    const connId = new mongoose.Types.ObjectId(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const chats = await chatSchema.find({
      $or: [
      { user: user._id, recipient: connId },
      { recipient: user._id, user: connId },
    ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      status: 200,
      chats
    });
  } catch (error) {
    console.error("Error in GetChats:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export default { sendChat, GetChats };