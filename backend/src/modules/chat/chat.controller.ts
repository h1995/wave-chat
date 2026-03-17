import { Server } from "socket.io";
import { ChatService } from "./chat.service";
import { ChatSocket } from "./chat.types";

export class ChatController {
    constructor(
        private io: Server,
        private service: ChatService
    ) { }

    handleConnection(socket: ChatSocket) {

        socket.on("join", ({ username }) => {
            this.service.addUser(socket.id, username);
            socket.username = username;
        });

        socket.on("connect-user", ({ targetUsername }) => {
            const result = this.service.connectUsers(socket.id, targetUsername);

            if (!result.success) {
                socket.emit("error", result.error);
                return;
            }

            socket.emit("chat-start");

            const targetSocket = this.io.sockets.sockets.get(result.targetId);
            targetSocket?.emit("incoming-chat", { from: socket.username });
        });

        socket.on("send-message", ({ message }) => {
            const result = this.service.sendMessage(socket.id, message);

            if (!result) return;

            const partnerSocket = this.io.sockets.sockets.get(result.to);
            partnerSocket?.emit("receive-message", {
                message,
                from: socket.id
            });
        });

        socket.on("end-chat", () => {
            const result = this.service.endChat(socket.id);

            if (!result) return;

            socket.emit("chat-ended");

            const partnerSocket = this.io.sockets.sockets.get(result.partnerId);
            partnerSocket?.emit("chat-ended");
        });

        socket.on("disconnect", () => {
            const result = this.service.disconnect(socket.id);

            if (!result?.partnerId) return;

            const partnerSocket = this.io.sockets.sockets.get(result.partnerId);
            partnerSocket?.emit("chat-ended");
        });
    }
}