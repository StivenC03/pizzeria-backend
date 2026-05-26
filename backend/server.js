require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// 1. AGGIUNGI IL TUO LINK VERCEL QUI
const allowedOrigins = [
  'http://localhost:3000', 
  'https://pizzeria-frontend-xbfp.onrender.com',
  'https://pizzeria-frontend-rho.vercel.app' 
];

// Configurazione Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

app.set('io', io);

// Middleware CORS per Express
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Bloccato dalla policy CORS'));
      }
    },
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser()); 

// Rotte
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const prenotazioneRoutes = require('./routes/prenotazioneRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/prenotazioni', prenotazioneRoutes);

// Connessione MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connesso con successo'))
  .catch(err => console.error('Errore di connessione a MongoDB:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));