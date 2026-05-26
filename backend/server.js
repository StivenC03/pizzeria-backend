const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://pizzeria-frontend-xbfp.onrender.com",
    methods: ["GET", "POST", "DELETE"],
    credentials: true
  }
});

app.set('io', io);

app.use(cors({
    origin: "https://pizzeria-frontend-xbfp.onrender.com", 
    credentials: true 
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const prenotazioneRoutes = require('./routes/prenotazioneRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/prenotazioni', prenotazioneRoutes);

mongoose.connect(process.env.MONGO_URI || 'tua_stringa_di_connessione')
  .then(() => console.log('MongoDB Connesso'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));