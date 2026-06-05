const path = require('node:path');
const { randomUUID } = require('node:crypto');
const express = require('express');
const http = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

io.on('connection', (socket) => {
  socket.data.username = `User-${socket.id.slice(0, 5)}`;

  socket.emit('system:message', {
    text: 'Connected to the chat server.',
    createdAt: new Date().toISOString()
  });

  socket.broadcast.emit('system:message', {
    text: `${socket.data.username} joined.`,
    createdAt: new Date().toISOString()
  });

  socket.on('user:setName', (username) => {
    const cleanName = String(username || '').trim().slice(0, 24);

    if (!cleanName) {
      socket.emit('system:message', {
        text: 'Username cannot be empty.',
        createdAt: new Date().toISOString()
      });
      return;
    }

    const previousName = socket.data.username;
    socket.data.username = cleanName;

    io.emit('system:message', {
      text: `${previousName} is now ${cleanName}.`,
      createdAt: new Date().toISOString()
    });
  });

  socket.on('chat:message', (message) => {
    const text = String(message || '').trim().slice(0, 500);

    if (!text) {
      return;
    }

    io.emit('chat:message', {
      id: randomUUID(),
      username: socket.data.username,
      text,
      createdAt: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('system:message', {
      text: `${socket.data.username} left.`,
      createdAt: new Date().toISOString()
    });
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server listening on http://localhost:${PORT}`);
});
