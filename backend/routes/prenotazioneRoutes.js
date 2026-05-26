const express = require('express');
const router = express.Router();
const prenotazioneController = require('../controllers/prenotazioneController');

router.get('/disponibilita/:data/:orario', prenotazioneController.getDisponibilita);
router.get('/:username', prenotazioneController.getPrenotazioniUtente);
router.post('/', prenotazioneController.creaPrenotazione);
router.delete('/:id', prenotazioneController.eliminaPrenotazione);

module.exports = router;