import { Router } from "express";
import ProductsManagerMongo from "../daos/Mongo/productsManagerMongo.js";
import MessageManagerMongo from "../daos/Mongo/messageManagerMongo.js";




const messagesRouter = Router();

const messageManager = new MessageManagerMongo()



messagesRouter.post("/messages", async (req, res) => {
    const { user, message } = req.body;

    try {
        const newMessage = await MessageManagerMongo.addMessage(user, message);
        res.json(newMessage);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar el mensaje" });
    }
})

messagesRouter.get("/messages", async (req, res) => {
    
    try {
        const messages = await messageManager.getAllMessages();
        res.json(messages);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los mensajes" });
    }
});

export default messagesRouter
