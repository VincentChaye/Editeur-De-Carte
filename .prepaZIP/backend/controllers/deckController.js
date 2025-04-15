const Deck = require('../models/Deck');

exports.createDeck = async (req, res) => {
  try {
    const newDeck = new Deck(req.body);
    const savedDeck = await newDeck.save();
    res.status(201).json(savedDeck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDecks = async (req, res) => {
  try {
    const decks = await Deck.find();
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeckById = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck non trouvé" });
    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDeck = async (req, res) => {
	try {
	  await Deck.findByIdAndDelete(req.params.id);
	  res.json({ message: "Deck supprimé" });
	} catch (err) {
	  res.status(500).json({ error: err.message });
	}
  };
  
  exports.updateDeck = async (req, res) => {
	try {
	  const updated = await Deck.findByIdAndUpdate(req.params.id, req.body, { new: true });
	  res.json(updated);
	} catch (err) {
	  res.status(500).json({ error: err.message });
	}
  };
  