type Keys = {
  ArrowUp?: boolean;
  ArrowLeft?: boolean;
  ArrowDown?: boolean;
  ArrowRight?: boolean;
  w?: boolean;
  a?: boolean;
  s?: boolean;
  d?: boolean;
  Control?: boolean;
  " "?: boolean;
};

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasHeight = (canvas.height = window.innerHeight - 10);
const canvasWidth = (canvas.width = window.innerWidth - 10);
const gravityAcceleration = 2;
const keys: Keys = {};

let gameSpeed = 3;

const player = {
  xPosition: 0,
  yPosition: canvasHeight - 64,
  width: 64,
  height: 64,
  originalHeight: 64,
  color: "black",
  yVelocity: 0,
  jumpHoldFrames: 0,
  jumpVelocity: 16,
  isGrounded: false,
};

const obstacle = {
  xPosition: canvasWidth,
  yPosition: canvasHeight - 32 - 48, // TODO: Randomize between air and ground obstacle.
  width: 32,
  height: 32,
  color: "maroon",
};

const clearDrawing = () => {
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
};

const drawPlayer = () => {
  canvasCtx.fillStyle = player.color;
  canvasCtx.fillRect(
    player.xPosition,
    player.yPosition,
    player.width,
    player.height
  );
};

const drawObstacle = () => {
  canvasCtx.fillStyle = obstacle.color;
  canvasCtx.fillRect(
    obstacle.xPosition,
    obstacle.yPosition,
    obstacle.width,
    obstacle.height
  );
};

const gravity = () => {
  if (player.yPosition + player.height + player.yVelocity < canvasHeight) {
    player.yVelocity += gravityAcceleration;
    player.yPosition += player.yVelocity;
    player.isGrounded = false;
  } else {
    player.yVelocity = 0;
    player.yPosition = canvasHeight - player.height;
    player.isGrounded = true;
  }
};

const jump = () => {
  if (keys[" "] || keys["w"] || keys["ArrowUp"]) {
    if (player.isGrounded && player.jumpHoldFrames === 0) {
      player.jumpHoldFrames = 1;
      player.yVelocity = -player.jumpVelocity;
    } else if (
      player.jumpHoldFrames > 0 &&
      player.jumpHoldFrames <= player.jumpVelocity
    ) {
      player.jumpHoldFrames++;
      player.yVelocity = -player.jumpVelocity - player.jumpHoldFrames / 75;
    }
  } else {
    player.jumpHoldFrames = 0;
  }
};

const duck = () => {
  if (keys["s"] || keys["Control"] || keys["ArrowDown"]) {
    if (player.isGrounded) {
      player.height = player.originalHeight / 2;
      player.yPosition = canvasHeight - player.height;
    }
  } else {
    player.height = player.originalHeight;
  }
};

const spawnObstacle = () => {
  obstacle.xPosition -= gameSpeed;

  if (obstacle.xPosition + obstacle.width < canvasWidth - canvasWidth) {
    obstacle.xPosition = canvasWidth;
  }
};

const animate = () => {
  gravity();
  spawnObstacle();
  jump();
  duck();
  clearDrawing();
  drawPlayer();
  drawObstacle();
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  keys[e.key as keyof Keys] = true;
});

document.addEventListener("keyup", (e) => {
  e.preventDefault();
  keys[e.key as keyof Keys] = false;
});
