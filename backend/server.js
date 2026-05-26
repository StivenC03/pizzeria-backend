require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://pizzeria-frontend-xbfp.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

app.set('io', io);


app.use(cors({
    origin: "https://pizzeria-frontend-xbfp.onrender.com", 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); 

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const prenotazioneRoutes = require('./routes/prenotazioneRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/prenotazioni', prenotazioneRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connesso con successo'))
  .catch(err => console.error('Errore di connessione a MongoDB:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));