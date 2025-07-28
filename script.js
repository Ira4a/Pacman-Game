const width = 20;
const height = 20;
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");

let score = 0;
let time = 60;
let pacmanPos = 221;
let ghostPositions = [22, 377, 378];

const layout = [
  // 400 клеток (20x20), 1 = стена, 0 = путь
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0,1,
  1,0,1,0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,1,
  1,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,1,0,1,1,
  1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,
  1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,
  1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0,1,
  1,0,1,0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,1,
  1,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,1,0,1,1,
  1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,
  1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,
  1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,
  1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,
  1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,
  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

const grid = [];

function createBoard() {
  for (let i = 0; i < layout.length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (layout[i] === 1) {
      cell.classList.add("wall");
    } else {
      cell.innerHTML = "<div class='dot'></div>";
    }
    game.appendChild(cell);
    grid.push(cell);
  }

  draw();
}

function draw() {
  grid.forEach(cell => {
    cell.classList.remove("pacman", "ghost");
  });

  grid[pacmanPos].classList.add("pacman");
  ghostPositions.forEach(pos => grid[pos].classList.add("ghost"));
}

document.addEventListener("keydown", e => {
  let nextPos = pacmanPos;

  if (e.key === "ArrowUp") nextPos -= width;
  else if (e.key === "ArrowDown") nextPos += width;
  else if (e.key === "ArrowLeft") nextPos -= 1;
  else if (e.key === "ArrowRight") nextPos += 1;

  if (layout[nextPos] !== 1 && nextPos >= 0 && nextPos < layout.length) {
    pacmanPos = nextPos;
    eatDot();
    checkGameOver();
    draw();
  }
});

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

function moveGhosts() {
  ghostPositions = ghostPositions.map(pos => {
    const directions = [-1, 1, -width, width];
    const shuffled = directions.sort(() => Math.random() - 0.5);

    for (let dir of shuffled) {
      const newPos = pos + dir;
      if (layout[newPos] !== 1 && newPos !== pacmanPos) {
        return newPos;
      }
    }

    return pos;
  });

  checkGameOver();
  draw();
}

function checkGameOver() {
  if (ghostPositions.includes(pacmanPos)) {
    message.textContent = "💀 Game Over!";
    clearInterval(interval);
  }
}

let interval = setInterval(() => {
  time--;
  timerDisplay.textContent = `Time: ${time}`;
  moveGhosts();

  if (time === 0) {
    message.textContent = "⏰ Time's up!";
    clearInterval(interval);
  }
}, 700);

createBoard();
