const mongoose = require('mongoose');

const PrenotazioneSchema = new mongoose.Schema({
  username: String,
  data: String,
  orario: String,
  persone: Number
});

module.exports = mongoose.model('Prenotazione', PrenotazioneSchema);