const mongoose = require('mongoose');

const champSchema = new mongoose.Schema({
  nom: String,
  valeur: String,
  type: String,
  align: String,
  offset: Number,
  couleur: String,
  opacite: Number,
  taille: Number,
  top: Number,
  largeur: Number,
  hauteur: Number,
  rotation: Number,
  gras: Boolean,
  italique: Boolean,
  souligne: Boolean,
  font: String
});

const carteSchema = new mongoose.Schema({
  titre: String,
  champs: [champSchema]
});

const deckSchema = new mongoose.Schema({
  nom: String,
  cartes: [carteSchema],
  auteur: String, // optionnel
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deck', deckSchema);
