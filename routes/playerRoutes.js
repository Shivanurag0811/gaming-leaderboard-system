const express = require('express');
const router = express.Router();
const { getPlayers, createPlayer, updatePlayer, deletePlayer } = require('../controllers/playerController');

// Get all players
router.get('/', getPlayers);

// Create a player
router.post('/', createPlayer);

// Update a player
router.put('/:id', updatePlayer);

// Delete a player
router.delete('/:id', deletePlayer);

module.exports = router;
