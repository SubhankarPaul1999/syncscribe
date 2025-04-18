const socketio = require('socket.io');
const Document = require('../models/Document');

let io;

const setupSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-document', async (documentId) => {
      socket.join(documentId);
      console.log(`User joined document: ${documentId}`);
      
      const document = await Document.findById(documentId);
      if (document) {
        socket.emit('load-document', document.content);
      }
    });

    socket.on('send-changes', (delta, documentId) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    socket.on('save-document', async (data, documentId) => {
      await Document.findByIdAndUpdate(documentId, { content: data });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = { setupSocket };