const socket = io('http://localhost:5000'); // Connect to the server
const startGameButton = document.getElementById('startGame');
const gameCanvas = document.getElementById('gameCanvas');
const playerScoreDisplay = document.getElementById('playerScore');
const leaderboardTable = document.getElementById('leaderboardTable');
const scoreForm = document.getElementById('scoreForm');

let playerScore = 0;
let gameActive = false;

// Initialize Canvas
const ctx = gameCanvas.getContext('2d');
gameCanvas.width = 400;
gameCanvas.height = 400;

// Game Logic
function startGame() {
  if (gameActive) return;
  gameActive = true;
  playerScore = 0;
  playerScoreDisplay.textContent = playerScore;

  const target = {
    x: Math.random() * (gameCanvas.width - 30),
    y: Math.random() * (gameCanvas.height - 30),
    size: 30,
  };

  function drawTarget() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = '#ff6f61';
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkHit(event) {
    const rect = gameCanvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const distance = Math.sqrt(
      (clickX - target.x) ** 2 + (clickY - target.y) ** 2
    );

    if (distance < target.size) {
      playerScore += 10;
      playerScoreDisplay.textContent = playerScore;
      target.x = Math.random() * (gameCanvas.width - 30);
      target.y = Math.random() * (gameCanvas.height - 30);
      drawTarget();
    }
  }

  drawTarget();
  gameCanvas.addEventListener('click', checkHit);

  setTimeout(() => {
    gameActive = false;
    gameCanvas.removeEventListener('click', checkHit);
    alert(`Game Over! Your score: ${playerScore}`);
    socket.emit('newScore', { username: 'Player', score: playerScore });
  }, 15000); // 15 seconds
}

startGameButton.addEventListener('click', startGame);

// Handle leaderboard updates from the server
socket.on('scoreUpdate', (data) => {
  leaderboardTable.innerHTML = '';
  data.forEach((entry, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.username}</td>
        <td>${entry.region || 'Global'}</td>
        <td>${entry.score}</td>
      </tr>`;
    leaderboardTable.innerHTML += row;
  });
});

// Handle score submission
scoreForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const playerName = document.getElementById('playerName').value;
  const score = parseInt(document.getElementById('score').value);
  const region = document.getElementById('region').value;

  socket.emit('submitScore', { playerName, score, region });
  scoreForm.reset();
});
