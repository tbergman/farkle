import express from 'express';
import http from 'http'
import socketio from 'socket.io'
import cors from 'cors'
import { newRoomCode } from './util/roomCode'
import { initSocket } from './socket';

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = socketio(server)

const activeGames = {}

const PORT = 4000

// When a user hits /init, we create a new socket
app.get('/init', (req, res) => {
  const roomCode = newRoomCode()
  const gameIO = io.of(`/${roomCode}`)
  activeGames[roomCode] = gameIO
  initSocket(gameIO)
  res.send({roomCode})
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});