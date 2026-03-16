import { Socket } from "socket.io";

export interface ChatSocket extends Socket {
    partnerId?: string;
}