const app = require('./app');
const http = require('http');
const { setupSocket } = require('./utils/socket'); // Now this will work

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup Socket.io
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});