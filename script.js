const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");

const width = 20;
const height = 20;
const totalCells = width * height;

let pacmanPos = 210;
let ghostPos = 100;
let score = 0;
let time = 60;
let interval;

const grid = [];

// Create grid
for (let i = 0; i < totalCells; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  if (Math.random() > 0.7) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    cell.appendChild(dot);
  }
  game.appendChild(cell);
  grid.push(cell);
}

// Render characters
function draw() {
  grid.forEach(cell => {
    cell.classList.remove("pacman", "ghost");
  });

  grid[pacmanPos].classList.add("pacman");
  grid[ghostPos].classList.add("ghost");
}

// Pac-Man movement
document.addEventListener("keydown", e => {
  grid[pacmanPos].classList.remove("pacman");

  if (e.key === "ArrowUp" && pacmanPos >= width) pacmanPos -= width;
  if (e.key === "ArrowDown" && pacmanPos < totalCells - width) pacmanPos += width;
  if (e.key === "ArrowLeft" && pacmanPos % width !== 0) pacmanPos -= 1;
  if (e.key === "ArrowRight" && (pacmanPos + 1) % width !== 0) pacmanPos += 1;

  eatDot();
  draw();
  checkGameOver();
});

// Ghost AI (random)
function moveGhost() {
  const directions = [-1, 1, -width, width];
  const dir = directions[Math.floor(Math.random() * directions.length)];
  const nextPos = ghostPos + dir;
  if (nextPos >= 0 && nextPos < totalCells) {
    ghostPos = nextPos;
  }
  draw();
  checkGameOver();
}

// Eat dot
function eatDot() {
  const dot = grid[pacmanPos].querySelector(".dot");
  if (dot) {
    dot.remove();
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  if (document.querySelectorAll(".dot").length === 0) {
    message.textContent = "🎉 You Win!";
    clearInterval(interval);
  }
}

// Game over
function checkGameOver() {
  if (pacmanPos === ghostPos) {
    message.textContent = "💀 Game Over!";
    clearInterval(interval);
  }
}

// Timer
interval = setInterval(() => {
  time--;
  timerDisplay.textContent = `Time: ${time}`;
  if (time === 0) {
    message.textContent = "⏰ Time's up!";
    clearInterval(interval);
  }
  moveGhost();
}, 800);

draw();
