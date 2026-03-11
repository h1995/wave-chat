import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';

import CONFIG from './config';

const app = express();
const router = express.Router();

const httpServer = http.createServer(app);
const io = new IOServer(httpServer);

app.use(router);
app.use(cors({ origin: '*' }));

interface ChatSocket extends Socket {
  partner?: string;
}

const users = new Map();
io.on('connection', (socket: ChatSocket) => {

  console.log(`User connected: ${socket.id}`);

  users.set(socket.id, socket);

  socket.on('connect-user', ({ targetId }) => {

    const targetSocket = users.get(targetId);

    if (targetSocket) {
      socket.partner = targetId;
      targetSocket.partner = socket.id;
      socket.emit('chat-start');
      targetSocket.emit('incoming-chat', { from: socket.id });
    } else {
      socket.emit('user-not-found');
    }

  });

  socket.on('send-message', ({ message }) => {

    const partner = users.get(socket.partner);

    if (partner) {
      partner.emit('receive-message', {
        message,
        from: socket.id,
      });
    }

  });


  socket.on('disconnect', () => {

    console.log(`User disconnected: ${socket.id}`);


    if (!socket.partner) {
      users.delete(socket.id);
      return;
    }

    const partner = users.get(socket.partner);

    if (partner) {
      partner.emit('chat-ended');
      partner.partner = null;
    }

    users.delete(socket.id);

  });

  socket.on("end-chat", () => {

    const partnerId = users.get(socket.id);

    if (partnerId) {
      const partnerSocket = io.sockets.sockets.get(partnerId);

      if (partnerSocket) {
        partnerSocket.emit("chat-ended");
      }

      users.delete(socket.id);
    }

    socket.emit("chat-ended");

  });




});

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server listening on *:${CONFIG.PORT} 🚀`);
});
