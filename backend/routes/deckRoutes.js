const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deckController');

router.post('/', deckController.createDeck);
router.get('/', deckController.getAllDecks);
router.get('/:id', deckController.getDeckById);
router.delete('/:id', deckController.deleteDeck);
router.put('/:id', deckController.updateDeck);


module.exports = router;
