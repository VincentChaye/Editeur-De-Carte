const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const deckRoutes = require('./routes/deckRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB:", err));

app.use('/api/decks', deckRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));
