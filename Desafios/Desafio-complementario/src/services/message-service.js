import { messageModel } from "../models/messages.js";

export class MessageService {

    getMessages = async() => {
        let response = { payload: null, error: null };

        await messageModel.find().then((res) => {
            response.payload = res;
            response.message = "Messages found";
            response.status = 'success';
            response.code = 200;
        }).catch((error) => {
            response.error = error.errors;
            response.message = error.message;
            response.status = 'error';
            response.code = 400;
        });

        return response;
    }

    addMessage = async(message) => {
        let response = { payload: null, error: null };

        await messageModel.create(message).then((res) => {
            response.payload = res;
            response.message = "Message added successfully";
            response.status = 'success';
            response.code = 201;
        }).catch((error) => {
            response.error = error.errors;
            response.message = error.message;
            response.status = 'error';
            response.code = 400;
        });

        return response;
    }
}