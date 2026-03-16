import { ChatSocket } from "../types/socket.types";

export class ChatService {

    private users = new Map<string, ChatSocket>();

    addUser(socket: ChatSocket, username: string) {
        socket.username = username;
        this.users.set(socket.id, socket);

    }

    removeUser(socketId: string) {
        this.users.delete(socketId);
    }

    connectUsers(socket: ChatSocket, targetUsername: string) {

        const targetSocketArr = [...this.users.values()];
        const targetSocket = targetSocketArr.find(user => user.username === targetUsername);

        if (!targetSocket) {
            socket.emit("user-not-found");
            return;
        }

        socket.partnerId = targetSocket.id;
        targetSocket.partnerId = socket.id;

        socket.emit("chat-start");

        targetSocket.emit("incoming-chat", {
            from: socket.username
        });
    }

    sendMessage(socket: ChatSocket, message: string) {

        const partner = this.users.get(socket.partnerId || "");

        if (!partner) return;

        partner.emit("receive-message", {
            message,
            from: socket.id
        });
    }

    endChat(socket: ChatSocket) {

        const partnerId = socket.partnerId;

        if (!partnerId) return;

        const partner = this.users.get(partnerId);

        partner?.emit("chat-ended");
        socket.emit("chat-ended");
        if (partner) partner.partnerId = undefined;

        socket.partnerId = undefined;
    }

    disconnect(socket: ChatSocket) {

        const partnerId = socket.partnerId;

        if (partnerId) {

            const partner = this.users.get(partnerId);

            partner?.emit("chat-ended");

            if (partner) partner.partnerId = undefined;
        }

        this.removeUser(socket.id);
    }

}