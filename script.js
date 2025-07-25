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

let pacmanIndex = 21;
let ghostIndex = 141;
let score = 0;
let timeLeft = 60;

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
  checkGameOver();
}

function moveGhost() {
  const directions = [-1, +1, -width, +width];
  let direction = directions[Math.floor(Math.random() * directions.length)];
  let nextIndex = ghostIndex + direction;

  if (
    nextIndex >= 0 &&
    nextIndex < layout.length &&
    !cells[nextIndex].classList.contains('wall')
  ) {
    cells[ghostIndex].classList.remove('ghost');
    ghostIndex = nextIndex;
    cells[ghostIndex].classList.add('ghost');
  }

  checkGameOver();
}

function checkWin() {
  if (!document.querySelector('.dot')) {
    clearInterval(ghostTimer);
    clearInterval(timerInterval);
    alert("🎉 You Win!");
    location.reload();
  }
}

function checkGameOver() {
  if (ghostIndex === pacmanIndex || timeLeft <= 0) {
    clearInterval(ghostTimer);
    clearInterval(timerInterval);
    alert("💀 Game Over");
    location.reload();
  }
}

// Initialize
createBoard();
drawPacman();
cells[ghostIndex].classList.add('ghost');
updateScore();
updateTimer();

document.addEventListener('keydown', movePacman);
const ghostTimer = setInterval(moveGhost, 500);
const timerInterval = setInterval(() => {
  timeLeft--;
  updateTimer();
  if (timeLeft <= 0) checkGameOver();
}, 1000);
