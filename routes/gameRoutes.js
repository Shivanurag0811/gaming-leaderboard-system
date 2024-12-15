const express = require('express');
const router = express.Router();
const { getGames, createGame, updateGame, deleteGame } = require('../controllers/gameController');

// Get all games
router.get('/', getGames);

// Create a game
router.post('/', createGame);

// Update a game
router.put('/:id', updateGame);

// Delete a game
router.delete('/:id', deleteGame);

module.exports = router;
