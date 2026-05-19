const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const prenotazioneRoutes = require('./routes/prenotazioneRoutes');


const menuController = require('./controllers/menuController');


const app = express(); 
const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;


app.use(cors({
  origin: function(origin, callback){ return callback(null, true); },
  credentials: true 
}));


app.use(express.json()); 
app.use(cookieParser()); 


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    
    console.log("Connesso a MongoDB");
    
    menuController.inizializzaMenu(); 
  })
  .catch(err => console.error("Errore di connessione", err));


app.use('/api', authRoutes); 
app.use('/api', menuRoutes); 
app.use('/api', prenotazioneRoutes); 


app.listen(PORT, () => {

  console.log(`Server modulare in ascolto sulla porta ${PORT}`);
});