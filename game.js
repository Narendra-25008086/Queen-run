let player = document.getElementById("player");
let scoreText = document.getElementById("score");
let highScoreText = document.getElementById("highScore");
let game = document.getElementById("game");

// lanes: 3 positions across screen
let lanes = [window.innerWidth * 0.2, window.innerWidth * 0.5, window.innerWidth * 0.8];
let currentLane = 1;

let obstacles = [];
let score = 0;
let speed = 6;
let gameRunning = true;

// high score logic
let previousHighScore = localStorage.getItem("highScore") || 0;
let highScore = previousHighScore; // current high score
highScoreText.innerText = "High: " + highScore;

// place player
function updatePlayer() {
  player.style.left = lanes[currentLane] + "px";
  player.style.transform = "translateX(-50%)";
}
updatePlayer();

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" && currentLane > 0) currentLane--;
  if (e.key === "ArrowRight" && currentLane < 2) currentLane++;
  updatePlayer();
  if (e.key === "ArrowUp") jump();
});

// Mobile swipe controls
let touchStartX = 0;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});
document.addEventListener("touchend", (e) => {
  let touchEndX = e.changedTouches[0].clientX;
  let diff = touchEndX - touchStartX;

  if (diff > 50 && currentLane < 2) currentLane++;  // swipe right
  else if (diff < -50 && currentLane > 0) currentLane--; // swipe left
  updatePlayer();
});

// Jump function
function jump() {
  player.innerText = "😈";
  player.style.bottom = "150px";
  setTimeout(() => {
    player.style.bottom = "50px";
    player.innerText = "👸";
  }, 300);
}

// Create enemy obstacles
function createObstacle() {
  let obs = document.createElement("div");
  obs.classList.add("obstacle");
  let enemies = ["👺", "😈", "💀"];
  obs.innerText = enemies[Math.floor(Math.random() * enemies.length)];

  let lane = Math.floor(Math.random() * 3);
  obs.style.left = lanes[lane] + "px";

  game.appendChild(obs);
  obstacles.push({ element: obs, top: -50 });
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;

  score++;
  scoreText.innerText = score;

  obstacles.forEach((obs, index) => {
    obs.top += speed;
    obs.element.style.top = obs.top + "px";

    let playerRect = player.getBoundingClientRect();
    let obsRect = obs.element.getBoundingClientRect();

    if (
      playerRect.left < obsRect.right &&
      playerRect.right > obsRect.left &&
      playerRect.top < obsRect.bottom &&
      playerRect.bottom > obsRect.top
    ) {
      endGame();
    }

    if (obs.top > window.innerHeight) {
      obs.element.remove();
      obstacles.splice(index, 1);
    }
  });

  requestAnimationFrame(gameLoop);
}

// Spawn obstacles
setInterval(() => {
  if (gameRunning) createObstacle();
}, 900);

// Game over
function endGame() {
  gameRunning = false;

  // Update high score only if player crossed previous high
  if (score > previousHighScore) {
    highScore = score;
    localStorage.setItem("highScore", score); // save new high
  }

  highScoreText.innerText = "High: " + highScore;

  document.getElementById("gameOver").style.display = "block";
}

// Restart
function restart() {
  location.reload();
}

// Start game loop
gameLoop();