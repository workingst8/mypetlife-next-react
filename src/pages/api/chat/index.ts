import { Server as SocketIOServer } from 'socket.io';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initializing socket.io server...");
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/chat"
    });

    io.on('connection', socket => {
      console.log('클라이언트가 연결되었습니다. Socket ID:', socket.id);

      socket.on('new-message', (msg) => {
        console.log('Received message:', msg);

        const messageToSend = {
          ...msg,
          fromSocketId: socket.id
        };

        console.log('Broadcasting message:', messageToSend);

        io.emit('receive-message', messageToSend);
      });

      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} has disconnected.`);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io already initialized.");
  }
  res.end();
}
