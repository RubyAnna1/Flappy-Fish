const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playAgainBtn = document.getElementById('playAgain');
const offlineBanner = document.getElementById('offline-banner');

let fish = { x: 50, y: 150, width: 60, height: 60, gravity: 0.7, velocity: 40 };
let pipes = [];
let score = 0;
let gameOver = false;
let background = new Image();
let fishImg = new Image();
let pipeImg = new Image();
let bgMusic = new Audio('assets/music.mp3');
let jumpSound = new Audio('assets/jump.wav');
let gameOverSound = new Audio('assets/gameover.wav');

background.src = 'assets/background.png';
fishImg.src = 'assets/fish.png';
pipeImg.src = 'assets/pipe.png';

function drawFish() {
  ctx.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    if (pipe.isBottom) {
      // Rotate bottom pipe
      ctx.save();
      ctx.translate(pipe.x + pipe.width / 2, pipe.y + pipe.height / 2);
      ctx.rotate(Math.PI); // 180 degrees
      ctx.drawImage(pipeImg, -pipe.width / 2, -pipe.height / 2, pipe.width, pipe.height);
      ctx.restore();
    } else {
      ctx.drawImage(pipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function resetGame() {
  fish.y = 150;
  fish.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  playAgainBtn.style.display = 'none';
  document.getElementById('gameOverScore').style.display = 'none'; // ✅ Hide score
  bgMusic.currentTime = 0;
  bgMusic.play();
  loop();
}


function startGame() {
  resetGame();
}

function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  drawFish();
  drawPipes();
  drawScore();

  fish.velocity += fish.gravity;
  fish.y += fish.velocity;

  // Add new pipe
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
    let height = Math.floor(Math.random() * 200) + 100;
    pipes.push({ x: canvas.width, y: 0, width: 100, height: height, isBottom: false });
    pipes.push({ x: canvas.width, y: height + 330, width: 100, height: canvas.height, isBottom: true });
  }

  // Move pipes
  pipes.forEach(pipe => pipe.x -= 2);

  // Remove old pipes
  if (pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.splice(0, 2);
    score++;
  }

  // Collision detection
  pipes.forEach(pipe => {
    if (
      fish.x < pipe.x + pipe.width &&
      fish.x + fish.width > pipe.x &&
      fish.y < pipe.y + pipe.height &&
      fish.y + fish.height > pipe.y
    ) {
      gameOver = true;
      bgMusic.pause();
      gameOverSound.play();
      playAgainBtn.style.display = 'block';
    document.getElementById('gameOverScore').innerText = `Score: ${score}`;
    document.getElementById('gameOverScore').style.display = 'block';
    }
  });

  // Out of bounds
  if (fish.y > canvas.height || fish.y < 0) {
    gameOver = true;
    bgMusic.pause();
    gameOverSound.play();
    playAgainBtn.style.display = 'block';
  }

  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    fish.velocity = -15;
    jumpSound.play();
  }
});

canvas.addEventListener('click', () => {
  fish.velocity = -15;
  jumpSound.play();
});

window.addEventListener('online', () => (offlineBanner.style.display = 'none'));
window.addEventListener('offline', () => (offlineBanner.style.display = 'block'));

bgMusic.loop = true;
bgMusic.play();
loop();
