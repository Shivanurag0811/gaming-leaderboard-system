const Score = require('../models/Score');
const Player = require('../models/player');
const Game = require('../models/game');

// Get all scores
const getScores = async (req, res) => {
  try {
    const scores = await Score.find().populate('playerId gameId'); // Populates player and game details
    res.status(200).json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new score
const createScore = async (req, res) => {
  const { playerId, gameId, score } = req.body;
  // Inside createScore() method in scoreController.js
const MAX_SCORE_INCREASE = 1000;  // Set threshold for reasonable score increase

if (score > MAX_SCORE_INCREASE) {
  return res.status(400).json({ message: 'Unreasonable score increase detected!' });
}

  // Validate the input
  if (!playerId || !gameId || !score) {
    return res.status(400).json({ message: 'Player ID, Game ID, and score are required.' });
  }

  try {
    // Find the player and game to validate existence
    const player = await Player.findById(playerId);
    const game = await Game.findById(gameId);

    if (!player || !game) {
      return res.status(404).json({ message: 'Player or Game not found' });
    }

    // Create a new score
    const newScore = new Score({
      playerId,
      gameId,
      score
    });

    // Update the total score for the player
    player.totalScore += score;
    await player.save();

    // Save the new score to the database
    await newScore.save();

    res.status(201).json(newScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }

};

// Update a score by ID
const updateScore = async (req, res) => {
  const { score } = req.body;

  try {
    const existingScore = await Score.findById(req.params.id);
    if (!existingScore) {
      return res.status(404).json({ message: 'Score not found' });
    }

    // Update the player's total score
    const player = await Player.findById(existingScore.playerId);
    player.totalScore -= existingScore.score; // Subtract old score
    player.totalScore += score; // Add new score
    await player.save();

    existingScore.score = score;
    await existingScore.save();

    res.status(200).json(existingScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a score by ID
const deleteScore = async (req, res) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);
    if (!score) {
      return res.status(404).json({ message: 'Score not found' });
    }

    // Update the player's total score
    const player = await Player.findById(score.playerId);
    player.totalScore -= score.score;
    await player.save();

    res.status(204).json();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getScores, createScore, updateScore, deleteScore };
