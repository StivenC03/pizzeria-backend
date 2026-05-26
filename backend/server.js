require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

// Inizializzazione Express e Server HTTP (necessario per Socket.io)
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

// 1. Configurazione delle origini consentite (Frontend Vercel/Localhost)
const allowedOrigins = [
  'http://localhost:3000', 
  'https://pizzeria-frontend-xbfp.onrender.com',
  'https://pizzeria-frontend-rho.vercel.app' 
];

// 2. Configurazione Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Rendiamo l'istanza io accessibile alle rotte (se necessario)
app.set('io', io);

// 3. Middleware CORS per Express (unificato)
app.use(cors({
    origin: function (origin, callback) {
      // Consenti richieste senza origine (es. Postman) o quelle nell'array
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

// Middleware per il parsing del body e dei cookie
app.use(express.json());
app.use(cookieParser()); 

// Middleware di Debug (utile per vedere le richieste su Render)
app.use((req, res, next) => {
    console.log(`[DEBUG] Ricevuta richiesta: ${req.method} ${req.url}`);
    next();
});

// Importazione delle rotte e controller
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const prenotazioneRoutes = require('./routes/prenotazioneRoutes');
const menuController = require('./controllers/menuController');

// 4. Connessione a MongoDB in cloud (Requisito di Progetto)
mongoose.connect(dbURI)
  .then(() => {
    console.log("MongoDB Connesso con successo");
    // Inizializza il menu nel DB se necessario
    menuController.inizializzaMenu(); 
  })
  .catch(err => console.error("Errore di connessione a MongoDB:", err));

// 5. Registrazione delle rotte API
app.use('/api', authRoutes); 
app.use('/api', menuRoutes); 
app.use('/api', prenotazioneRoutes); 

// 6. Avvio del Server (Uso 'server.listen' per supportare Socket.io!)
server.listen(PORT, () => {
  console.log(`Server modulare in ascolto sulla porta ${PORT}`);
});