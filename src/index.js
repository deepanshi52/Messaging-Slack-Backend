import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import MessageSocketHandlers from './controller/messageSocketController.js';
import ChannelSocketHandlers from './controller/messageSocketController.js';
import apiRouter from './routes/apiRoutes.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ui', bullServerAdapter.getRouter()); 

// Routes
app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
  return res.status(StatusCodes.OK).json({ message: 'pong' });
});

io.on('connection', (socket) => {
//   console.log('a user connected', socket.id);

// socket.on('messageFromClient', (data) => {
//   console.log('Message from client', data);

//   io.emit('new message', data.toUpperCase())
// });  

   MessageSocketHandlers(io, socket);
   ChannelSocketHandlers(io, socket);

});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
