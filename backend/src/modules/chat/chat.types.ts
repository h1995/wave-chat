import { Socket } from "socket.io";

export interface ChatSocket extends Socket {
    username?: string;
}


export type ConnectSuccess = {
    success: true;
    targetId: string;
};

export type ConnectError = {
    success: false;
    error: string;
};

export type ConnectResult = ConnectSuccess | ConnectError;