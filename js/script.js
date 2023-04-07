//dom manipulation
const logo = document.getElementById("logo");
const startButton = document.getElementById("start-button");
const gameBoard = document.getElementById("game-board");
const canvas = document.getElementById("my-canvas");

let obstacles = [];
let obstacleId;
let animationId;
let score = 0;
let gameOn = false;
const ctx = canvas.getContext("2d");
const background = new Image();
const flappyImg = new Image();
const obstacleImgTop = new Image();
const obstacleImgBottom = new Image();
background.src = "./images/bg.png";
flappyImg.src = "./images/flappy.png";
obstacleImgTop.src = "./images/obstacle_top.png";
obstacleImgBottom.src = "./images/obstacle_bottom.png";

class Obstacle {
  constructor() {
    this.gap = 200;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.gap);
    this.bottomY = this.y + this.gap;
    this.width = 138;
  }
  update() {
    this.x -= 2;
    this.draw;
  }
  draw() {
    ctx.drawImage(obstacleImgBottom, this.x, this.bottomY);
    ctx.drawImage(obstacleImgTop, this.x, this.y - obstacleImgTop.height);
  }
}

const flappy = {
  x: 600,
  y: 300,
  width: 80,
  height: 56,
  speedX: 0,
  speedY: 0,
  gravity: 0.05,
  gravitySpeed: 0,
  update() {
    if (this.y + this.height >= canvas.height) {
      this.y -= 20;
    }
    if (this.y <= 0) {
      this.y += 20;
    }
    if (this.speedY < 8) {
      this.speedY += this.gravity;
    } else {
      this.speedY = this.speedY;
    }
    this.y += this.speedY;
    ctx.drawImage(flappyImg, this.x, this.y, this.width, this.height);
  },
  newPosition(event) {
    switch (event.code) {
      case "ArrowLeft":
        this.x -= 6;

        break;
      case "ArrowRight":
        this.x += 6;

        break;
      case "Space":
        if (this.speedY > -5) {
          this.speedY -= 1;
        }
        break;
    }
  },
};

function generateObstacles() {
  obstacles.push(new Obstacle());
}

function startGame() {
  gameOn = true;
  animationId = setInterval(animationLoop, 16);
  obstacleId = setInterval(generateObstacles, 4000);
}

function gameOver() {
  console.log("game over");
  clearInterval(animationId);
  clearInterval(obstacleId);
  clearCanvas();
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText(`Game Over`, 450, 250);
  ctx.font = "32px Arial";
  ctx.fillText(`Final Score: ${score}`, 450, 350);

  obstacles = [];
  flappy.x = 400;
  flappy.y = 200;
  flappy.speedY = 0;
  gameOn = false;
  score = 0;
  startButton.classList.remove("hidden");
}

function checkCollision(object) {
  if (
    flappy.x < object.x + object.width &&
    flappy.x + flappy.width > object.x
  ) {
    if (flappy.y <= object.y) {
      flappy.y += 20;
    }
    if (flappy.y + flappy.height >= object.bottomY) {
      flappy.y -= 20;
    }
  }

  if (
    flappy.x < object.x + object.width &&
    flappy.x + flappy.width > object.x &&
    !(flappy.y > object.y && flappy.y + flappy.height < object.bottomY)
  ) {
    gameOver();
  }
}

//one iteration of what happens during an animation frame
function animationLoop() {
  clearCanvas();
  drawBackground();
  flappy.update();
  obstacles.forEach((obstacle, i, arr) => {
    obstacle.update();
    obstacle.draw();
    checkCollision(obstacle);
    if (obstacle.x < -obstacle.width) {
      score++;
      arr.splice(i, 1);
    }
  });
}

function drawBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.onload = function () {
  document.getElementById("start-button").onclick = function () {
    if (!gameOn) {
      logo.classList.add("hidden");
      startButton.classList.add("hidden");
      gameBoard.classList.remove("hidden");
      startGame();
    }
  };
};

document.addEventListener("keypress", (event) => {
  event.preventDefault();
  flappy.newPosition(event);
});
