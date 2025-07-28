class PacmanGame {
  constructor() {
    this.board = document.getElementById('game-board');
    this.scoreElement = document.getElementById('score');
    this.highScoreElement = document.getElementById('high-score');
    this.timerElement = document.getElementById('timer');
    this.livesElement = document.getElementById('lives');
    this.startButton = document.getElementById('start-btn');
    
    this.width = 20;
    this.cellSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size'));
    this.cells = [];
    this.score = 0;
    this.highScore = localStorage.getItem('pacman-highscore') || 0;
    this.lives = 3;
    this.timeLeft = 60;
    this.gameActive = false;
    this.pacmanDirection = 'right';
    this.lastDirection = 'right';
    
    this.ghosts = [
      { name: 'blinky', index: 141, class: 'blinky', direction: null, stepCount: 0, isScared: false },
      { name: 'pinky', index: 163, class: 'pinky', direction: null, stepCount: 0, isScared: false },
      { name: 'inky', index: 183, class: 'inky', direction: null, stepCount: 0, isScared: false },
      { name: 'clyde', index: 201, class: 'clyde', direction: null, stepCount: 0, isScared: false }
    ];
    
    this.layout = [
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,0,1,
      1,2,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,2,1,
      1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,
      1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,
      1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1,
      1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,1,
      1,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,
      1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];
    
    this.pacmanIndex = 21;
    this.powerPelletActive = false;
    this.powerPelletTimer = null;
    
    this.init();
  }
  
  init() {
    this.createBoard();
    this.setupEventListeners();
    this.updateHighScore();
  }
  
  createBoard() {
    this.board.innerHTML = '';
    this.cells = [];
    
    for (let i = 0; i < this.layout.length; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      
      if (this.layout[i] === 1) {
        cell.classList.add('wall');
      } else if (this.layout[i] === 0) {
        cell.classList.add('dot');
      } else if (this.layout[i] === 2) {
        cell.classList.add('power-pellet');
      } else if (this.layout[i] === 3) {
        cell.classList.add('tunnel');
      }
      
      this.board.appendChild(cell);
      this.cells.push(cell);
    }
  }
  
  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    this.startButton.addEventListener('click', () => this.startGame());
    
    // Mobile controls
    document.querySelectorAll('.arrow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleKeyPress({ key: `Arrow${btn.dataset.direction.toUpperCase()}` });
      });
    });
  }
  
  startGame() {
    if (this.gameActive) return;
    
    this.resetGame();
    this.gameActive = true;
    this.startButton.disabled = true;
    this.startButton.textContent = 'GAME RUNNING';
    
    this.drawPacman();
    this.drawGhosts();
    
    this.ghostInterval = setInterval(() => this.moveGhosts(), 500);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();
      if (this.timeLeft <= 0) this.gameOver("TIME'S UP!");
    }, 1000);
  }
  
  resetGame() {
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 60;
    this.pacmanIndex = 21;
    this.pacmanDirection = 'right';
    this.lastDirection = 'right';
    this.powerPelletActive = false;
    
    this.ghosts = [
      { name: 'blinky', index: 141, class: 'blinky', direction: null, stepCount: 0, isScared: false },
      { name: 'pinky', index: 163, class: 'pinky', direction: null, stepCount: 0, isScared: false },
      { name: 'inky', index: 183, class: 'inky', direction: null, stepCount: 0, isScared: false },
      { name: 'clyde', index: 201, class: 'clyde', direction: null, stepCount: 0, isScared: false }
    ];
    
    this.createBoard();
    this.updateScore();
    this.updateLives();
    this.updateTimer();
  }
  
  drawPacman() {
    this.cells[this.pacmanIndex].classList.add('pacman', this.pacmanDirection);
  }
  
  erasePacman() {
    this.cells[this.pacmanIndex].classList.remove('pacman', 'up', 'down', 'left', 'right');
  }
  
  drawGhosts() {
    this.ghosts.forEach(ghost => {
      this.cells[ghost.index].classList.add('ghost', ghost.class);
      if (ghost.isScared) {
        this.cells[ghost.index].classList.add('scared');
      }
    });
  }
  
  eraseGhosts() {
    this.ghosts.forEach(ghost => {
      this.cells[ghost.index].classList.remove('ghost', 'blinky', 'pinky', 'inky', 'clyde', 'scared');
    });
  }
  
  handleKeyPress(e) {
    if (!this.gameActive) return;
    
    switch (e.key) {
      case 'ArrowUp':
        this.pacmanDirection = 'up';
        break;
      case 'ArrowDown':
        this.pacmanDirection = 'down';
        break;
      case 'ArrowLeft':
        this.pacmanDirection = 'left';
        break;
      case 'ArrowRight':
        this.pacmanDirection = 'right';
        break;
      default:
        return;
    }
    
    this.lastDirection = this.pacmanDirection;
    this.movePacman();
  }
  
  movePacman() {
    this.erasePacman();
    
    let nextIndex = this.pacmanIndex;
    
    switch (this.pacmanDirection) {
      case 'up':
        if (this.pacmanIndex - this.width >= 0 && !this.cells[this.pacmanIndex - this.width].classList.contains('wall')) {
          nextIndex = this.pacmanIndex - this.width;
        }
        break;
      case 'down':
        if (this.pacmanIndex + this.width < this.layout.length && !this.cells[this.pacmanIndex + this.width].classList.contains('wall')) {
          nextIndex = this.pacmanIndex + this.width;
        }
        break;
      case 'left':
        if (this.pacmanIndex % this.width !== 0 && !this.cells[this.pacmanIndex - 1].classList.contains('wall')) {
          nextIndex = this.pacmanIndex - 1;
        }
        break;
      case 'right':
        if ((this.pacmanIndex + 1) % this.width !== 0 && !this.cells[this.pacmanIndex + 1].classList.contains('wall')) {
          nextIndex = this.pacmanIndex + 1;
        }
        break;
    }
    
    // Handle tunnel teleport
    if (nextIndex === this.pacmanIndex && this.cells[this.pacmanIndex].classList.contains('tunnel')) {
      if (this.pacmanDirection === 'left' && this.pacmanIndex % this.width === 0) {
        nextIndex = this.pacmanIndex + this.width - 1;
      } else if (this.pacmanDirection === 'right' && (this.pacmanIndex + 1) % this.width === 0) {
        nextIndex = this.pacmanIndex - this.width + 1;
      }
    }
    
    if (nextIndex !== this.pacmanIndex) {
      this.pacmanIndex = nextIndex;
      this.checkCell();
    }
    
    this.drawPacman();
    this.checkCollision();
  }
  
  checkCell() {
    const cell = this.cells[this.pacmanIndex];
    
    if (cell.classList.contains('dot')) {
      cell.classList.remove('dot');
      this.score += 10;
      this.updateScore();
      this.playSound('waka');
    } else if (cell.classList.contains('power-pellet')) {
      cell.classList.remove('power-pellet');
      this.score += 50;
      this.updateScore();
      this.activatePowerPellet();
      this.playSound('waka');
    }
    
    this.checkWin();
  }
  
  activatePowerPellet() {
    this.powerPelletActive = true;
    this.ghosts.forEach(ghost => {
      ghost.isScared = true;
    });
    this.eraseGhosts();
    this.drawGhosts();
    
    if (this.powerPelletTimer) {
      clearTimeout(this.powerPelletTimer);
    }
    
    this.powerPelletTimer = setTimeout(() => {
      this.powerPelletActive = false;
      this.ghosts.forEach(ghost => {
        ghost.isScared = false;
      });
      this.eraseGhosts();
      this.drawGhosts();
    }, 10000); // 10 seconds
  }
  
  moveGhosts() {
    this.eraseGhosts();
    
    const directions = [-1, +1, -this.width, +this.width];
    
    this.ghosts.forEach(ghost => {
      // Recalculate direction after 3 steps or if no valid direction
      if (ghost.direction === null || ghost.stepCount >= 3) {
        let validDirs = directions.filter(dir => {
          const next = ghost.index + dir;
          return (
            next >= 0 &&
            next < this.layout.length &&
            !this.cells[next].classList.contains('wall') &&
            !this.ghosts.some(g => g !== ghost && g.index === next)
          );
        });
        
        if (validDirs.length > 0) {
          // If scared, move randomly
          if (ghost.isScared) {
            ghost.direction = validDirs[Math.floor(Math.random() * validDirs.length)];
          } 
          // Otherwise, move toward Pac-Man
          else {
            const pacmanRow = Math.floor(this.pacmanIndex / this.width);
            const pacmanCol = this.pacmanIndex % this.width;
            const ghostRow = Math.floor(ghost.index / this.width);
            const ghostCol = ghost.index % this.width;
            
            // Calculate direction toward Pac-Man
            const rowDiff = pacmanRow - ghostRow;
            const colDiff = pacmanCol - ghostCol;
            
            // Prioritize direction based on distance
            if (Math.abs(rowDiff) > Math.abs(colDiff)) {
              ghost.direction = rowDiff > 0 ? +this.width : -this.width;
            } else {
              ghost.direction = colDiff > 0 ? +1 : -1;
            }
            
            // If preferred direction isn't valid, choose a random valid one
            if (!validDirs.includes(ghost.direction)) {
              ghost.direction = validDirs[Math.floor(Math.random() * validDirs.length)];
            }
          }
          
          ghost.stepCount = 0;
        } else {
          ghost.direction = null;
          return;
        }
      }
      
      const nextIndex = ghost.index + ghost.direction;
      
      // Check if next move is valid
      if (
        nextIndex >= 0 &&
        nextIndex < this.layout.length &&
        !this.cells[nextIndex].classList.contains('wall') &&
        !this.ghosts.some(g => g !== ghost && g.index === nextIndex)
      ) {
        ghost.index = nextIndex;
        ghost.stepCount++;
      } else {
        // reset direction if blocked
        ghost.direction = null;
      }
    });
    
    this.drawGhosts();
    this.checkCollision();
  }
  
  checkCollision() {
    this.ghosts.forEach(ghost => {
      if (ghost.index === this.pacmanIndex) {
        if (ghost.isScared) {
          // Eat the ghost
          ghost.isScared = false;
          ghost.index = ghost.originalIndex || 100; // Reset ghost position
          this.score += 200;
          this.updateScore();
          this.playSound('ghost');
        } else {
          // Lose a life
          this.lives--;
          this.updateLives();
          this.playSound('game-over');
          
          if (this.lives <= 0) {
            this.gameOver("GAME OVER!");
          } else {
            // Reset positions
            this.erasePacman();
            this.eraseGhosts();
            
            this.pacmanIndex = 21;
            this.ghosts.forEach(g => {
              g.index = g.originalIndex || 100 + Math.floor(Math.random() * 50);
              g.isScared = false;
            });
            
            setTimeout(() => {
              this.drawPacman();
              this.drawGhosts();
            }, 1000);
          }
        }
      }
    });
  }
  
  checkWin() {
    const dotsLeft = Array.from(this.cells).some(cell => cell.classList.contains('dot') || cell.classList.contains('power-pellet'));
    
    if (!dotsLeft) {
      this.gameWin();
    }
  }
  
  updateScore() {
    this.scoreElement.textContent = `SCORE: ${this.score}`;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.updateHighScore();
    }
  }
  
  updateHighScore() {
    this.highScoreElement.textContent = `HIGH: ${this.highScore}`;
    localStorage.setItem('pacman-highscore', this.highScore);
  }
  
  updateTimer() {
    this.timerElement.textContent = `TIME: ${this.timeLeft}`;
  }
  
  updateLives() {
    this.livesElement.textContent = `LIVES: ${this.lives}`;
  }
  
  playSound(type) {
    const sound = document.getElementById(`${type}-sound`);
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }
  
  gameOver(reason) {
    this.stopGame();
    alert(`${reason}\nYOUR SCORE: ${this.score}`);
    this.resetGameUI();
  }
  
  gameWin() {
    this.stopGame();
    alert(`YOU WIN!\nSCORE: ${this.score}`);
    this.resetGameUI();
  }
  
  stopGame() {
    clearInterval(this.ghostInterval);
    clearInterval(this.timerInterval);
    clearTimeout(this.powerPelletTimer);
    this.gameActive = false;
  }
  
  resetGameUI() {
    this.startButton.disabled = false;
    this.startButton.textContent = 'PLAY AGAIN';
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new PacmanGame();
});
