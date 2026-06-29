require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

const allowedOrigins = [
  'http://localhost:3000', 
  'https://pizzeria-frontend-xbfp.onrender.com',
  'https://pizzeria-frontend-rho.vercel.app' 
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

app.set('io', io);

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Bloccato dalla policy CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser()); 

app.use((req, res, next) => {
    console.log(`[DEBUG] Ricevuta richiesta: ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const prenotazioneRoutes = require('./routes/prenotazioneRoutes');
const menuController = require('./controllers/menuController');

mongoose.connect(dbURI)
  .then(() => {
    console.log("MongoDB Connesso con successo");
    menuController.inizializzaMenu(); 
  })
  .catch(err => console.error("Errore di connessione a MongoDB:", err));

app.use('/api', authRoutes); 
app.use('/api', menuRoutes); 
app.use('/api', prenotazioneRoutes); 

server.listen(PORT, () => {
  console.log(`Server modulare in ascolto sulla porta ${PORT}`);
});