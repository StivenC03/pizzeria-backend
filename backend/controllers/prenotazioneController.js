const Prenotazione = require('../models/Prenotazione');

exports.getPrenotazioniUtente = async (req, res) => {
  try {
    const tutteLePrenotazioni = await Prenotazione.find({ username: req.params.username });
    
    const oggi = new Date();
    
    const dataDiOggi = oggi.toISOString().split('T')[0]; 
 
    const ore = String(oggi.getHours()).padStart(2, '0');
    const minuti = String(oggi.getMinutes()).padStart(2, '0');
    const oraAttuale = `${ore}:${minuti}`;

  
    const prenotazioniAttive = tutteLePrenotazioni.filter(p => {
        if (p.data > dataDiOggi) return true;
        if (p.data === dataDiOggi && p.orario >= oraAttuale) return true;
        return false;
    });

   
    prenotazioniAttive.sort((a, b) => {
        if (a.data === b.data) return a.orario.localeCompare(b.orario);
        return a.data.localeCompare(b.data);
    });

    res.json(prenotazioniAttive);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero delle prenotazioni" });
  }
};


exports.creaPrenotazione = async (req, res) => {
  try {
    const { username, data, orario, persone } = req.body;
    const numPersone = parseInt(persone, 10);

  
    const dataInserita = new Date(data);
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0); 

    if (dataInserita < oggi) {
      return res.status(400).json({ success: false, message: "Non puoi prenotare in una data passata!" });
    }

  
    const prenotazioneEsistente = await Prenotazione.findOne({ username, data });
    if (prenotazioneEsistente) {
      return res.status(400).json({ 
        success: false, 
        message: "Hai già una prenotazione per questa data!" 
      });
    }
    
    const prenotazioniDelGiorno = await Prenotazione.find({ data });
    
  
    const totalePersoneGiorno = prenotazioniDelGiorno.reduce((acc, curr) => acc + curr.persone, 0);
    
    if (totalePersoneGiorno + numPersone > 120) {
       return res.status(400).json({ 
           success: false, 
           message: `Limite giornaliero superato. Posti totali rimanenti per il ${data}: ${120 - totalePersoneGiorno}` 
       });
    }

    
    const prenotazioniFascia = prenotazioniDelGiorno.filter(p => p.orario === orario);
    
   
    const totalePersoneFascia = prenotazioniFascia.reduce((acc, curr) => acc + curr.persone, 0);
    
    if (totalePersoneFascia + numPersone > 20) {
       return res.status(400).json({ 
           success: false, 
           message: `Fascia oraria ${orario} al completo. Posti rimanenti: ${20 - totalePersoneFascia}` 
       });
    }
  

    const nuovaPrenotazione = new Prenotazione({ username, data, orario, persone: numPersone });
    await nuovaPrenotazione.save();
    res.json({ success: true, message: "Prenotazione salvata con successo!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Errore nel salvataggio" });
  }
};

exports.eliminaPrenotazione = async (req, res) => {
  try {
    await Prenotazione.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Prenotazione cancellata!" });
  } catch (err) {
    res.status(500).json({ message: "Errore nella cancellazione" });
  }
};