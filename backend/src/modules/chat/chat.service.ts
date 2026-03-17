import { ChatStore } from "./chat.store";
import { ConnectResult } from "./chat.types";

export class ChatService {
    constructor(private store: ChatStore) { }

    addUser(userId: string, username: string) {
        this.store.addUser({ id: userId, username });
    }

    connectUsers(userId: string, targetUsername: string): ConnectResult {
        const user = this.store.getUser(userId);
        const target = this.store.getUserByUsername(targetUsername);

        if (!user || !target) return { success: false, error: "USER_NOT_FOUND" };
        if (user.id === target.id) return { success: false, error: "SELF_CONNECT" };

        this.store.setPartner(user.id, target.id);
        this.store.setPartner(target.id, user.id);

        return { success: true, targetId: target.id };
    }

    sendMessage(userId: string, message: string) {
        const user = this.store.getUser(userId);
        if (!user?.partnerId) return null;

        return { to: user.partnerId, message };
    }

    endChat(userId: string) {
        const user = this.store.getUser(userId);
        if (!user?.partnerId) return null;

        const partnerId = user.partnerId;

        this.store.setPartner(userId);
        this.store.setPartner(partnerId);

        return { partnerId };
    }

    disconnect(userId: string) {
        const user = this.store.getUser(userId);
        if (!user) return null;

        const partnerId = user.partnerId;

        if (partnerId) {
            this.store.setPartner(partnerId);
        }

        this.store.removeUser(userId);

        return { partnerId };
    }
}