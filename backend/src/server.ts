import express from "express";
import cors from "cors";
import http from "http";
import { initSocket } from "./sockets/socket";
import CONFIG from "./configs/config";

const app = express();
app.use(cors({ origin: "*" }));

const httpServer = http.createServer(app);

// initialize socket
initSocket(httpServer);

httpServer.listen(CONFIG.PORT, () => {
    console.log(`Server running on ${CONFIG.PORT}`);
});