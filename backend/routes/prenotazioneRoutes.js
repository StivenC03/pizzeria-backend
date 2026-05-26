const express = require('express');
const router = express.Router();
const prenController = require('../controllers/prenotazioneController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/prenotazioni/disponibilita/:data/:orario', prenController.getDisponibilita);
router.get('/prenotazioni/:username', prenController.getPrenotazioniUtente);
router.post('/prenotazioni', prenController.creaPrenotazione);
router.delete('/prenotazioni/:id', prenController.eliminaPrenotazione);

module.exports = router;