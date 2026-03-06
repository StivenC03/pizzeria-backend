const Pizza = require('../models/Pizza');

// Logica per il popolamento iniziale
exports.inizializzaMenu = async () => {
  try {
    const conteggio = await Pizza.countDocuments();
    if (conteggio === 0) {
      const prodottiBase = [
        { nome: "Margherita", descrizione: "Pomodoro, fior di latte, basilico", prezzo: 6.00, categoria: "Pizze", immagine: "/images/margherita.jpeg" },
        { nome: "Diavola", descrizione: "Pomodoro, fior di latte, salame piccante", prezzo: 7.50, categoria: "Pizze", immagine: "/images/diavola.jpeg" },
        { nome: "Capricciosa", descrizione: "Pomodoro, fior di latte, funghi, carciofini, prosciutto cotto, olive", prezzo: 8.50, categoria: "Pizze", immagine: "/images/capricciosa.jpeg" },
        { nome: "Quattro Formaggi", descrizione: "Fior di latte, gorgonzola, provola, parmigiano", prezzo: 8.00, categoria: "Pizze", immagine: "/images/quattro_formaggi.jpeg" },
        { nome: "Ortolana", descrizione: "Fior di latte, zucchine, melanzane, peperoni", prezzo: 7.50, categoria: "Pizze", immagine: "/images/ortolana.jpeg" },
        { nome: "Bufalina", descrizione: "Pomodoro, mozzarella di bufala DOP, basilico", prezzo: 8.00, categoria: "Pizze", immagine: "/images/bufalina.jpeg" },
        { nome: "Patatine Fritte", descrizione: "Porzione di patatine a bastoncino", prezzo: 3.50, categoria: "Antipasti", immagine: "" },
        { nome: "Crocchette di Patate", descrizione: "3 pezzi, fatte in casa", prezzo: 4.00, categoria: "Antipasti", immagine: "" },
        { nome: "Nuggets di Pollo", descrizione: "6 pezzi con salsa BBQ", prezzo: 4.50, categoria: "Antipasti", immagine: "" },
        { nome: "Acqua Naturale / Frizzante", descrizione: "Bottiglia 1L", prezzo: 2.00, categoria: "Bevande", immagine: "" },
        { nome: "Coca Cola / Zero", descrizione: "Lattina 33cl", prezzo: 2.50, categoria: "Bevande", immagine: "" },
        { nome: "The Pesca / Limone", descrizione: "Lattina 33cl", prezzo: 2.50, categoria: "Bevande", immagine: "" },
        { nome: "Birra Bionda", descrizione: "Spina 40cl", prezzo: 4.00, categoria: "Bevande", immagine: "" },
        { nome: "Vino Rosso / Bianco", descrizione: "Calice", prezzo: 4.50, categoria: "Bevande", immagine: "" }
      ];
      await Pizza.insertMany(prodottiBase);
      console.log("Menu iniziale inserito!");
    }
  } catch(err) {
    console.error("Errore inizializzazione menu", err);
  }
};

exports.getMenu = async (req, res) => {
  try {
    const menu = await Pizza.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "Errore del server" });
  }
};