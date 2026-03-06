const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001;

// Configurazione CORS fondamentale per accettare i cookie dal frontend
app.use(cors({
  origin: function(origin, callback){ return callback(null, true); },
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// Connessione a MongoDB (INSERISCI QUI IL TUO URI)
mongoose.connect('mongodb+srv://stiven:stiven2003@cluster0.vz9pbpw.mongodb.net/?appName=Cluster0')
  .then(() => console.log("Connesso a MongoDB"))
  .catch(err => console.error("Errore di connessione", err));

// --- MODELLI DATABASE ---

const MenuSchema = new mongoose.Schema({
  nome: String,
  descrizione: String,
  prezzo: Number,
  categoria: String, 
  immagine: String   
});
const Pizza = mongoose.model('Pizza', MenuSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const PrenotazioneSchema = new mongoose.Schema({
  username: String,
  data: String,
  orario: String, // Nuovo campo aggiunto
  persone: Number
});
const Prenotazione = mongoose.model('Prenotazione', PrenotazioneSchema);


// --- POPOLAMENTO INIZIALE DEL MENU ---
// Inserisce i prodotti SOLO se il database è vuoto. Non cancella nulla!
async function inizializzaMenu() {
  try {
    const conteggio = await Pizza.countDocuments(); // Conta quanti prodotti ci sono
    
    if (conteggio === 0) {
      const prodottiBase = [
        // Pizze
        { nome: "Margherita", descrizione: "Pomodoro, fior di latte, basilico", prezzo: 6.00, categoria: "Pizze", immagine: "/images/margherita.jpeg" },
        { nome: "Diavola", descrizione: "Pomodoro, fior di latte, salame piccante", prezzo: 7.50, categoria: "Pizze", immagine: "/images/diavola.jpeg" },
        { nome: "Capricciosa", descrizione: "Pomodoro, fior di latte, funghi, carciofini, prosciutto cotto, olive", prezzo: 8.50, categoria: "Pizze", immagine: "/images/capricciosa.jpeg" },
        { nome: "Quattro Formaggi", descrizione: "Fior di latte, gorgonzola, provola, parmigiano", prezzo: 8.00, categoria: "Pizze", immagine: "/images/quattro_formaggi.jpeg" },
        { nome: "Ortolana", descrizione: "Fior di latte, zucchine, melanzane, peperoni", prezzo: 7.50, categoria: "Pizze", immagine: "/images/ortolana.jpeg" },
        { nome: "Bufalina", descrizione: "Pomodoro, mozzarella di bufala DOP, basilico", prezzo: 8.00, categoria: "Pizze", immagine: "/images/bufalina.jpeg" },
        
        // Antipasti
        { nome: "Patatine Fritte", descrizione: "Porzione di patatine a bastoncino", prezzo: 3.50, categoria: "Antipasti", immagine: "" },
        { nome: "Crocchette di Patate", descrizione: "3 pezzi, fatte in casa", prezzo: 4.00, categoria: "Antipasti", immagine: "" },
        { nome: "Nuggets di Pollo", descrizione: "6 pezzi con salsa BBQ", prezzo: 4.50, categoria: "Antipasti", immagine: "" },
        
        // Bevande
        { nome: "Acqua Naturale / Frizzante", descrizione: "Bottiglia 1L", prezzo: 2.00, categoria: "Bevande", immagine: "" },
        { nome: "Coca Cola / Zero", descrizione: "Lattina 33cl", prezzo: 2.50, categoria: "Bevande", immagine: "" },
        { nome: "The Pesca / Limone", descrizione: "Lattina 33cl", prezzo: 2.50, categoria: "Bevande", immagine: "" },
        { nome: "Birra Bionda", descrizione: "Spina 40cl", prezzo: 4.00, categoria: "Bevande", immagine: "" },
        { nome: "Vino Rosso / Bianco", descrizione: "Calice", prezzo: 4.50, categoria: "Bevande", immagine: "" }
      ];
      
      await Pizza.insertMany(prodottiBase);
      console.log("Il database era vuoto: Menu iniziale inserito correttamente!");
    } else {
      console.log("Il menu è già presente nel database. Nessuna modifica effettuata.");
    }
  } catch(err) {
    console.log("Errore inserimento menu", err);
  }
}
inizializzaMenu();


// --- API MENU ---
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await Pizza.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "Errore del server" });
  }
});


// --- API AUTENTICAZIONE E SESSIONE ---

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username già in uso" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ success: true, message: "Registrazione completata! Ora puoi fare il login." });
  } catch (err) {
    res.status(500).json({ message: "Errore durante la registrazione" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Utente non trovato" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password errata" });

    res.cookie('sessione_utente', user.username, { 
      httpOnly: true, 
      secure: true,       // OBBLIGATORIO quando il sito è online (HTTPS)
      sameSite: 'none',   // OBBLIGATORIO perché frontend e backend hanno domini diversi
      maxAge: 1000 * 60 * 60 * 24 
    });

    res.json({ success: true, message: "Login effettuato!", username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Errore durante il login" });
  }
});

app.get('/api/check-session', (req, res) => {
  const utenteLoggato = req.cookies.sessione_utente;
  if (utenteLoggato) {
    res.json({ loggedIn: true, username: utenteLoggato });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('sessione_utente');
  res.json({ success: true, message: "Logout effettuato" });
});


// --- API PRENOTAZIONI ---

app.get('/api/prenotazioni/:username', async (req, res) => {
  try {
    const prenotazioni = await Prenotazione.find({ username: req.params.username });
    res.json(prenotazioni);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero prenotazioni" });
  }
});

app.post('/api/prenotazioni', async (req, res) => {
  try {
    const { username, data, orario, persone } = req.body;

    // 1. Validazione data passata
    const dataInserita = new Date(data);
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0); 

    if (dataInserita < oggi) {
      return res.status(400).json({ success: false, message: "Non puoi prenotare in una data passata!" });
    }

    // 2. NUOVO CONTROLLO: Verifica se l'utente ha già una prenotazione per questa data
    const prenotazioneEsistente = await Prenotazione.findOne({ 
      username: username, 
      data: data 
    });

    if (prenotazioneEsistente) {
      return res.status(400).json({ 
        success: false, 
        message: "Hai già una prenotazione per questa data! Cancellala prima di farne un'altra." 
      });
    }

    // 3. Salva la nuova prenotazione
    const nuovaPrenotazione = new Prenotazione({ username, data, orario, persone });
    await nuovaPrenotazione.save();
    res.json({ success: true, message: "Prenotazione salvata con successo!" });
    
  } catch (err) {
    res.status(500).json({ success: false, message: "Errore nel salvataggio" });
  }
});

app.delete('/api/prenotazioni/:id', async (req, res) => {
  try {
    await Prenotazione.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Prenotazione cancellata!" });
  } catch (err) {
    res.status(500).json({ message: "Errore nella cancellazione" });
  }
});

app.listen(port, () => {
  console.log(`Backend della pizzeria in ascolto sulla porta ${port}`);
});