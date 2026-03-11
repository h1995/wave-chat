import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect, vi, describe } from "vitest";
import { MemoryRouter } from "react-router";
import Chat from "../Chat";

describe("pages/Chat", () => {
    it("emits send-message event", () => {
        const emit = vi.fn();

        const mockSocket: any = {
            id: "123",
            on: () => { },
            off: () => { },
            emit
        };

        render(
            <MemoryRouter>
                <Chat socket={mockSocket} />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText("Type message...");
        const button = screen.getByText("Send");

        fireEvent.change(input, { target: { value: "Hello" } });

        button.click();

        expect(emit).toHaveBeenCalled();
    });
});