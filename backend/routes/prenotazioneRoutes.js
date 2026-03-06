const express = require('express');
const router = express.Router();
const prenController = require('../controllers/prenotazioneController');

router.get('/prenotazioni/:username', prenController.getPrenotazioniUtente);
router.post('/prenotazioni', prenController.creaPrenotazione);
router.delete('/prenotazioni/:id', prenController.eliminaPrenotazione);

module.exports = router;