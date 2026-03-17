import { Server } from "socket.io";
import { ChatController } from "../modules/chat/chat.controller";
import { ChatService } from "../modules/chat/chat.service";
import { ChatStore } from "../modules/chat/chat.store";

export const initSocket = (server: any) => {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    const store = new ChatStore();
    const service = new ChatService(store);
    const controller = new ChatController(io, service);

    io.on("connection", (socket) => {
        controller.handleConnection(socket);
    });
};