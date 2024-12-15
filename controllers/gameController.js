const Game = require('../models/game');

// Get all games
const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new game
const createGame = async (req, res) => {
  const { name, genre } = req.body;

  // Validate the input
  if (!name || !genre) {
    return res.status(400).json({ message: 'Name and genre are required.' });
  }

  const game = new Game({
    name,
    genre
  });

  try {
    await game.save();
    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a game by ID
const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a game by ID
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(204).json();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getGames, createGame, updateGame, deleteGame };
