const Prenotazione = require('../models/Prenotazione');

// Recupera le prenotazioni di un utente specifico
exports.getPrenotazioniUtente = async (req, res) => {
  try {
    const prenotazioni = await Prenotazione.find({ username: req.params.username });
    res.json(prenotazioni);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero delle prenotazioni" });
  }
};

// Crea una nuova prenotazione
exports.creaPrenotazione = async (req, res) => {
  try {
    const { username, data, orario, persone } = req.body;

    // Validazione data
    const dataInserita = new Date(data);
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0); 

    if (dataInserita < oggi) {
      return res.status(400).json({ success: false, message: "Non puoi prenotare in una data passata!" });
    }

    // Controllo se esiste già una prenotazione per quel giorno
    const prenotazioneEsistente = await Prenotazione.findOne({ username, data });
    if (prenotazioneEsistente) {
      return res.status(400).json({ 
        success: false, 
        message: "Hai già una prenotazione per questa data!" 
      });
    }

    const nuovaPrenotazione = new Prenotazione({ username, data, orario, persone });
    await nuovaPrenotazione.save();
    res.json({ success: true, message: "Prenotazione salvata con successo!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Errore nel salvataggio" });
  }
};

// Elimina una prenotazione
exports.eliminaPrenotazione = async (req, res) => {
  try {
    await Prenotazione.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Prenotazione cancellata!" });
  } catch (err) {
    res.status(500).json({ message: "Errore nella cancellazione" });
  }
};