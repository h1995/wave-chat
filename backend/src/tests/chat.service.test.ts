import { describe, it, expect, beforeEach } from "vitest";
import { ChatService } from "../modules/chat/chat.service";
import { ChatStore } from "../modules/chat/chat.store";

describe("ChatService", () => {
    let service: ChatService;
    let store: ChatStore;

    beforeEach(() => {
        store = new ChatStore();
        service = new ChatService(store);
    });

    it("should connect users", () => {
        service.addUser("A", "Alice");
        service.addUser("B", "Bob");

        const result = service.connectUsers("A", "Bob");

        expect(result.success).toBe(true);

        const userA = store.getUser("A");
        const userB = store.getUser("B");

        expect(userA?.partnerId).toBe("B");
        expect(userB?.partnerId).toBe("A");
    });

    it("should return error if user not found", () => {
        service.addUser("A", "Alice");

        const result = service.connectUsers("A", "Unknown");

        expect(result.success).toBe(false);
    });

    it("should send message to partner", () => {
        service.addUser("A", "Alice");
        service.addUser("B", "Bob");

        service.connectUsers("A", "Bob");

        const result = service.sendMessage("A", "Hello");

        expect(result?.to).toBe("B");
        expect(result?.message).toBe("Hello");
    });

    it("should notify partner on disconnect (logic level)", () => {
        service.addUser("A", "Alice");
        service.addUser("B", "Bob");

        service.connectUsers("A", "Bob");

        const result = service.disconnect("A");

        expect(result?.partnerId).toBe("B");

        const userB = store.getUser("B");

        expect(userB?.partnerId).toBeUndefined();
    });
});