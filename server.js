const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const playerRoutes = require('./routes/playerRoutes');
const gameRoutes = require('./routes/gameRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/scores', scoreRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Real-Time Communication
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = socketIo(server);

// Real-time score updates
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('scoreUpdate', (data) => {
    io.emit('scoreUpdate', data); // Broadcast score update to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  const cron = require('node-cron');
  const Player = require('./models/player');
  
  // Reset player scores at the beginning of each season
  cron.schedule('0 0 1 1 *', async () => {
    console.log('Starting new season... Resetting player scores.');
    await Player.updateMany({}, { totalScore: 0 });
  });
  
});
