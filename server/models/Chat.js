import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userQuery: String,
  response: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", chatSchema);