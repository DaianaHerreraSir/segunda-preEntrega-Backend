import messageModel from "../../models/messages.models.js";


class MessageManagerMongo {
    
async addMessage(user, message) {
    try {
        const newMessage = new messageModel({ user, message });
        await newMessage.save();
        return newMessage;
        } 
        catch (error) {
            throw error;
        }
    }


async getAllMessages() {
    try {
        const messages = await messageModel.find({});
        return messages;
        } 
        catch (error) {
            throw error;
        }
    }
}

export default MessageManagerMongo;
