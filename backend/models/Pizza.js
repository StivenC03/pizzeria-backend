const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  nome: String,
  descrizione: String,
  prezzo: Number,
  categoria: String, 
  immagine: String   
});

module.exports = mongoose.model('Pizza', MenuSchema);