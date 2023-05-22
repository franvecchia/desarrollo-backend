import { Router } from "express";
import { MessageService } from "../services/message-service.js";

const messageService = new MessageService();
const messageRouter = Router();

messageRouter.get('/chat', async(req, res) => {
    const result = await messageService.getMessages();
    const messages = result.payload.map(m => ({id: m._id, user: m.user, message: m.message}));

    res.render('chat', { titulo: "Chat Socket", messages: messages });
});

messageRouter.get('/', async(req, res) => {
    const result = await messageService.getMessages();

    res.status(result.code).send(result);

});

messageRouter.post('/', async(req, res) => {
    const {user, message} = req.body;

    const result = await messageService.addMessage({user,message});

    req.io.emit("messages", result);
    res.status(result.code).send(result);
});

export default messageRouter;