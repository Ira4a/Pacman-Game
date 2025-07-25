const game = document.getElementById("game");
const width = 20;
const layout = [
  // 0 = dot, 1 = wall
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,0,1,
  1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,
  1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,
  1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,
  1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1,
  1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
];

const cells = [];
let pacmanIndex = 21;
let score = 0;
let timeLeft = 60;

const ghosts = [
  { name: 'blinky', index: 141, class: 'blinky' },
  { name: 'pinky',  index: 161, class: 'pinky' },
  { name: 'inky',   index: 183, class: 'inky' }
];

function createBoard() {
  for (let i = 0; i < layout.length; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    if (layout[i] === 1) {
      cell.classList.add('wall');
    } else {
      cell.classList.add('dot');
    }
    game.appendChild(cell);
    cells.push(cell);
  }
}

function drawPacman() {
  cells[pacmanIndex].classList.add('pacman');
}

function erasePacman() {
  cells[pacmanIndex].classList.remove('pacman');
}

function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
}

function updateTimer() {
  document.getElementById("timer").innerText = "Time: " + timeLeft;
}

function drawGhosts() {
  ghosts.forEach(ghost => {
    cells[ghost.index].classList.add('ghost', ghost.class);
  });
}

function moveGhosts() {
  const directions = [-1, +1, -width, +width];

  ghosts.forEach(ghost => {
    let direction = directions[Math.floor(Math.random() * directions.length)];
    let nextIndex = ghost.index + direction;

    if (
      nextIndex >= 0 &&
      nextIndex < layout.length &&
      !cells[nextIndex].classList.contains("wall")
    ) {
      cells[ghost.index].classList.remove('ghost', ghost.class);
      ghost.index = nextIndex;
      cells[ghost.index].classList.add('ghost', ghost.class);
    }

    if (ghost.index === pacmanIndex) {
      gameOver(`Caught by ${ghost.name.toUpperCase()}!`);
    }
  });
}

function movePacman(e) {
  erasePacman();
  switch (e.key) {
    case "ArrowUp":
      if (pacmanIndex - width >= 0 && !cells[pacmanIndex - width].classList.contains("wall"))
        pacmanIndex -= width;
      break;
    case "ArrowDown":
      if (pacmanIndex + width < layout.length && !cells[pacmanIndex + width].classList.contains("wall"))
        pacmanIndex += width;
      break;
    case "ArrowLeft":
      if (pacmanIndex % width !== 0 && !cells[pacmanIndex - 1].classList.contains("wall"))
        pacmanIndex -= 1;
      break;
    case "ArrowRight":
      if ((pacmanIndex + 1) % width !== 0 && !cells[pacmanIndex + 1].classList.contains("wall"))
        pacmanIndex += 1;
      break;
  }

  if (cells[pacmanIndex].classList.contains("dot")) {
    cells[pacmanIndex].classList.remove("dot");
    score += 10;
    updateScore();
  }

  drawPacman();
  checkWin();
  checkCollision();
}

function checkWin() {
  if (!document.querySelector('.dot')) {
    stopGame();
    alert("🎉 You Win!");
    location.reload();
  }
}

function checkCollision() {
  if (ghosts.some(g => g.index === pacmanIndex)) {
    gameOver("Caught by ghost!");
  }
}

function gameOver(reason) {
  stopGame();
  alert("💀 Game Over: " + reason);
  location.reload();
}

function stopGame() {
  clearInterval(ghostTimer);
  clearInterval(timerInterval);
}

// Initialize
createBoard();
drawPacman();
drawGhosts();
updateScore();
updateTimer();

document.addEventListener('keydown', movePacman);

const ghostTimer = setInterval(moveGhosts, 500);
const timerInterval = setInterval(() => {
  timeLeft--;
  updateTimer();
  if (timeLeft <= 0) gameOver("Time's up!");
}, 1000);
