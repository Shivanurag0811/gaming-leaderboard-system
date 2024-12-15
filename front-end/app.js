// app.js

// Connect to the server using Socket.IO
const socket = io('http://localhost:5000');  // Update this to your server's URL if different

// DOM Elements
const leaderboardList = document.getElementById('leaderboardList');
const scoreForm = document.getElementById('scoreForm');
const playerNameInput = document.getElementById('playerName');
const scoreInput = document.getElementById('score');
const gameSelect = document.getElementById('game');
const globalLeaderboardBtn = document.getElementById('globalLeaderboardBtn');
const regionalLeaderboardBtn = document.getElementById('regionalLeaderboardBtn');

// Variables
let leaderboardData = [];

// Fetch Leaderboard Data
const fetchLeaderboard = async (isRegional = false) => {
  try {
    const response = await fetch(`http://localhost:5000/api/players`);
    const players = await response.json();

    // Sort players by score
    players.sort((a, b) => b.totalScore - a.totalScore);

    if (isRegional) {
      // Example: Filter players by region (you can implement your region logic here)
      players = players.filter(player => player.region === 'US');
    }

    leaderboardData = players;

    // Update the leaderboard display
    displayLeaderboard(players);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
  }
};

// Display Leaderboard
const displayLeaderboard = (players) => {
  leaderboardList.innerHTML = '';
  players.forEach((player, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.username}</td>
      <td>${player.region}</td>
      <td>${player.totalScore}</td>
    `;
    leaderboardList.appendChild(row);
  });
};

// Handle Score Submission
scoreForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = playerNameInput.value;
  const score = parseInt(scoreInput.value);
  const game = gameSelect.value;

  try {
    // Send the score to the server
    await fetch('http://localhost:5000/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        score,
        gameId: game, // Assuming you are sending a game ID or name
      }),
    });

    // Reset form inputs
    playerNameInput.value = '';
    scoreInput.value = '';

    // Trigger re-fetch to update leaderboard
    fetchLeaderboard();
  } catch (err) {
    console.error('Error submitting score:', err);
  }
});

// Real-time leaderboard updates with Socket.IO
socket.on('scoreUpdate', (newScore) => {
  // Update leaderboard with the new score
  leaderboardData.push(newScore);
  leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
  displayLeaderboard(leaderboardData);
});

// Event Listeners for Filter Buttons
globalLeaderboardBtn.addEventListener('click', () => fetchLeaderboard(false));  // Global leaderboard
regionalLeaderboardBtn.addEventListener('click', () => fetchLeaderboard(true));  // Regional leaderboard

// Initial load
fetchLeaderboard(false);
