const express = require('express');
const router = express.Router();
const { getScores, createScore, updateScore, deleteScore } = require('../controllers/scoreController');

// Get scores
router.get('/', getScores);

// Create a score
router.post('/', createScore);

// Update a score
router.put('/:id', updateScore);

// Delete a score
router.delete('/:id', deleteScore);

module.exports = router;
