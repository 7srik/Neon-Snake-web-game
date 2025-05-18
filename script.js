const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const boxSize = 30;
let snake = [
  { x: 150, y: 150 },
  { x: 120, y: 150 }   
];
let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let intervalId;
let gameRunning = false;

document.addEventListener("keydown", changeDirection);
document.getElementById("toggleButton").addEventListener("click", toggleGame);

function toggleGame() {
  if (!gameRunning) {
    resetGame();
    intervalId = setInterval(update, 150);
    gameRunning = true;
    document.getElementById("toggleButton").textContent = "⏸ Pause";
    document.getElementById("gameOverMsg").style.display = "none";
  } else {
    clearInterval(intervalId);
    gameRunning = false;
    document.getElementById("toggleButton").textContent = "▶ Start";
  }
}

function resetGame() {
  snake = [
    { x: 150, y: 150 },
    { x: 120, y: 150 }
  ];
  direction = "RIGHT";
  food = spawnFood();
  score = 0;
  document.getElementById("score").textContent = score;
}


function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
  };
}

function changeDirection(e) {
  const key = e.key;
  if (key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function update() {
  let head = { ...snake[0] };
  if (direction === "RIGHT") head.x += boxSize;
  else if (direction === "LEFT") head.x -= boxSize;
  else if (direction === "UP") head.y -= boxSize;
  else if (direction === "DOWN") head.y += boxSize;

  // Wall collision or self collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    clearInterval(intervalId);
    gameRunning = false;
    document.getElementById("toggleButton").textContent = "▶ Start";
    document.getElementById("gameOverMsg").style.display = "block";
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((part, i) => {
    const gradient = ctx.createLinearGradient(part.x, part.y, part.x + boxSize, part.y + boxSize);
    gradient.addColorStop(0, "#00ffe1");
    gradient.addColorStop(1, "#4e00ff");

    ctx.fillStyle = gradient;
    ctx.shadowColor = "#00ffe1";
    ctx.shadowBlur = 12;
    ctx.fillRect(part.x, part.y, boxSize, boxSize);
  });
  ctx.shadowBlur = 0;
}

function drawFood() {
  ctx.beginPath();
  ctx.arc(food.x + boxSize / 2, food.y + boxSize / 2, boxSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#ff006e";
  ctx.shadowColor = "#ff006e";
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}
