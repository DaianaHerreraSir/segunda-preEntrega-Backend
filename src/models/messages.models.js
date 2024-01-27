import mongoose from "mongoose";

const { Schema } = mongoose;

const messageCollection = "Message"

const messageSchema = new Schema({
    user: String,
    message: String
});

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel