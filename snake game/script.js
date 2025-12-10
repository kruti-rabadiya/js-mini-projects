const board = document.querySelector(".board");
const blockHeight = 30;
const blockWidth = 30;
const model = document.querySelector(".model");
const startgame = document.querySelector(".start-game");
const gameover = document.querySelector(".game-over");
const startBtn = document.querySelector(".btn-start");
let intervalId = null;
let timerIntervalId = null;
const restartButton = document.querySelector(".btn-restart");
const highscoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let highscore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = `00:00`;
timeElement.innerText = time;
highscoreElement.innerText = ` ${highscore}`;

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let snake = [{ x: 1, y: 3 }];

let direction = "right";
const blocks = [];
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${r} ${c}`] = block;
  }
}

function renderSnake() {
  let head = null;
  blocks[`${food.x} ${food.y}`].classList.add("food");
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    model.style.display = "flex";
    startgame.style.display = "none";
    gameover.style.display = "flex";
    return;
  }
  // food consume logic
  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x} ${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x} ${food.y}`].classList.add("food");
    snake.unshift(head);
    score += 10;
    scoreElement.innerText = ` ${score}`;
    if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore);
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x} ${segment.y}`].classList.remove("fill");
  });
  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    blocks[`${segment.x} ${segment.y}`].classList.add("fill");
  });
}
restartButton.addEventListener("click", restartGame);
function restartGame() {
  clearInterval(intervalId);
  blocks[`${food.x} ${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x} ${segment.y}`].classList.remove("fill");
  });
  direction = "right";
  model.style.display = "none";
  snake = [{ x: 1, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  score = 0;
  scoreElement.innerText = ` ${score}`;
  highscoreElement.innerText = ` ${highscore}`;
  time = `00:00`;
  timeElement.innerText = time;
  intervalId = setInterval(() => {
    renderSnake();
  }, 200);
}

startBtn.addEventListener("click", () => {
  model.style.display = "none";
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}:${sec}`;
    timeElement.innerText = time;
  }, 1000);
  intervalId = setInterval(() => {
    renderSnake();
  }, 200);
});

addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    direction = "left";
  } else if (event.key === "ArrowRight") {
    direction = "right";
  } else if (event.key === "ArrowUp") {
    direction = "up";
  } else if (event.key === "ArrowDown") {
    direction = "down";
  }
});
