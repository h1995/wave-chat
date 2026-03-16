import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import CONFIG from "./config";
import { ChatService } from "./services/chat.service";
import { ChatSocket } from "./types/socket.types";

const app = express();

app.use(cors({ origin: "*" }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "*" }
});

const chatService = new ChatService();

io.on("connection", (socket: ChatSocket) => {

    console.log(`User connected: ${socket.id}`);

    chatService.addUser(socket);

    socket.on("connect-user", ({ targetId }) => {
        chatService.connectUsers(socket, targetId);
    });

    socket.on("send-message", ({ message }) => {
        chatService.sendMessage(socket, message);
    });

    socket.on("end-chat", () => {
        chatService.endChat(socket);
    });

    socket.on("disconnect", () => {
        chatService.disconnect(socket);
    });

});

httpServer.listen(CONFIG.PORT, () => {
    console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
});