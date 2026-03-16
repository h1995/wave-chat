import { describe, it, expect, vi } from "vitest";
import { ChatService } from "../services/chat.service";

describe("ChatService", () => {

    it("should connect users", () => {

        const chat = new ChatService();

        const socketA: any = { id: "A", emit: () => { } };
        const socketB: any = { id: "B", emit: () => { } };

        chat.addUser(socketA, "Alice");
        chat.addUser(socketB, "Bob");

        chat.connectUsers(socketA, "Bob");

        expect(socketA.partnerId).toBe("B");
        expect(socketB.partnerId).toBe("A");

    });

    it("should emit user-not-found if target does not exist", () => {

        const chat = new ChatService();

        const emitMock = vi.fn();

        const socket: any = { id: "A", emit: emitMock };

        chat.addUser(socket, "Alice");

        chat.connectUsers(socket, "B");

        expect(emitMock).toHaveBeenCalledWith("user-not-found");

    });

    it("should send message to partner", () => {

        const chat = new ChatService();

        const emitA = vi.fn();
        const emitB = vi.fn();

        const socketA: any = { id: "A", emit: emitA };
        const socketB: any = { id: "B", emit: emitB };

        chat.addUser(socketA, "Alice");
        chat.addUser(socketB, "Bob");

        // connect them first
        chat.connectUsers(socketA, "Bob");

        // send message
        chat.sendMessage(socketA, "Hello");

        expect(emitB).toHaveBeenCalledWith("receive-message", {
            message: "Hello",
            from: "A"
        });

    });

    it("should notify partner when user disconnects", () => {

        const chat = new ChatService();

        const emitA = vi.fn();
        const emitB = vi.fn();

        const socketA: any = { id: "A", emit: emitA };
        const socketB: any = { id: "B", emit: emitB };

        chat.addUser(socketA, "Alice");
        chat.addUser(socketB, "Bob");

        // connect them first
        chat.connectUsers(socketA, "Bob");

        // now disconnect
        chat.disconnect(socketA);

        expect(emitB).toHaveBeenCalledWith("chat-ended");

    });

});