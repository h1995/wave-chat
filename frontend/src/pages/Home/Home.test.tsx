import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import Home from "../Home";

describe("pages/Home", () => {
    it("emits connect-user event", () => {
        const emit = vi.fn();

        const mockSocket: any = {
            id: "123",
            on: () => { },
            off: () => { },
            emit
        };

        render(
            <MemoryRouter>
                <Home socket={mockSocket} />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText("Enter user ID");
        const button = screen.getByText("Connect");

        fireEvent.change(input, { target: { value: "456" } });

        button.click();

        expect(emit).toHaveBeenCalled();
    });
});