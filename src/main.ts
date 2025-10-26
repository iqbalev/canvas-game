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

type Player = {
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  originalHeight: number;
  color: string;
  yVelocity: number;
  jumpHoldFrames: number;
  jumpVelocity: number;
  isGrounded: boolean;
};

type Obstacle = {
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  color: string;
};

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasHeight: number = (canvas.height = window.innerHeight - 10);
const canvasWidth: number = (canvas.width = window.innerWidth - 10);
const gravityAcceleration: number = 2;
const keys: Keys = {};

let gameSpeed: number = 3;

const player: Player = {
  xPosition: 64,
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

const obstacle: Obstacle = {
  xPosition: canvasWidth,
  yPosition: canvasHeight - 32 - 48, // TODO: Randomize between air and ground obstacle.
  width: 32,
  height: 32,
  color: "maroon",
};

const duck = (): void => {
  if (keys["s"] || keys["Control"] || keys["ArrowDown"]) {
    if (player.isGrounded) {
      player.height = player.originalHeight / 2;
      player.yPosition = canvasHeight - player.height;
    }
  } else {
    player.height = player.originalHeight;
  }
};

const jump = (): void => {
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

const gravity = (): void => {
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

const isPlayerCollideWithObstacle = (): boolean => {
  if (
    player.xPosition + player.width >= obstacle.xPosition &&
    player.xPosition <= obstacle.xPosition + obstacle.width &&
    player.yPosition + player.height >= obstacle.yPosition &&
    player.yPosition <= obstacle.yPosition + obstacle.height
  ) {
    return true;
  } else {
    return false;
  }
};

const spawnObstacle = (): void => {
  obstacle.xPosition -= gameSpeed;

  if (
    isPlayerCollideWithObstacle() ||
    obstacle.xPosition + obstacle.width < canvasWidth - canvasWidth
  ) {
    obstacle.xPosition = canvasWidth;
  }
};

const clearDrawing = (): void => {
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
};

const drawPlayer = (): void => {
  canvasCtx.fillStyle = player.color;
  canvasCtx.fillRect(
    player.xPosition,
    player.yPosition,
    player.width,
    player.height
  );
};

const drawObstacle = (): void => {
  canvasCtx.fillStyle = obstacle.color;
  canvasCtx.fillRect(
    obstacle.xPosition,
    obstacle.yPosition,
    obstacle.width,
    obstacle.height
  );
};

const start = (): void => {
  duck();
  jump();
  gravity();
  spawnObstacle();
  clearDrawing();
  drawPlayer();
  drawObstacle();
  requestAnimationFrame(start);
};

requestAnimationFrame(start);

document.addEventListener("keydown", (e) => {
  keys[e.key as keyof Keys] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key as keyof Keys] = false;
});
