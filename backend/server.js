const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import rotte
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const prenotazioneRoutes = require('./routes/prenotazioneRoutes');

// Import controller per inizializzazione
const menuController = require('./controllers/menuController');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: function(origin, callback){ return callback(null, true); },
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Connessione DB
mongoose.connect('mongodb+srv://stiven:stiven2003@cluster0.vz9pbpw.mongodb.net/?appName=Cluster0')
  .then(() => {
    console.log("Connesso a MongoDB");
    menuController.inizializzaMenu(); // Popolamento automatico
  })
  .catch(err => console.error("Errore di connessione", err));

// Utilizzo Rotte
app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', prenotazioneRoutes);

app.listen(port, () => {
  console.log(`Server modulare in ascolto sulla porta ${port}`);
});