type Keys = {
  ArrowUp?: boolean;
  ArrowLeft?: boolean;
  ArrowDown?: boolean;
  ArrowRight?: boolean;
  w?: boolean;
  a?: boolean;
  s?: boolean;
  d?: boolean;
  Shift?: boolean;
  " "?: boolean;
};

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasHeight = (canvas.height = window.innerHeight - 10);
const canvasWidth = (canvas.width = window.innerWidth - 10);
const gravityStrength = 2;
const keys: Keys = {};

const player = {
  x: 0,
  y: canvasHeight - 64,
  h: 64,
  w: 64,
  c: "black",
  dy: 0,
  jumpCharge: 0,
  jumpStrength: 16,
  isGrounded: false,
};

const obstacle = {
  x: canvasWidth - 64,
  y: canvasHeight - 64 - 48, // TODO: Randomize between air and ground obstacle.
  h: 64,
  w: 64,
  c: "red",
};

const clearDrawing = () => {
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
};

const drawPlayer = () => {
  canvasCtx.fillStyle = player.c;
  canvasCtx.fillRect(player.x, player.y, player.w, player.h);
};

const drawObstacle = () => {
  canvasCtx.fillStyle = obstacle.c;
  canvasCtx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
};

const gravity = () => {
  if (player.y + player.h + player.dy < canvasHeight) {
    player.dy += gravityStrength;
    player.y += player.dy;
    player.isGrounded = false;
  } else {
    player.dy = 0;
    player.y = canvasHeight - player.h;
    player.isGrounded = true;
  }
};

const jump = () => {
  if (keys[" "] || keys["w"] || keys["ArrowUp"]) {
    if (player.isGrounded && player.jumpCharge === 0) {
      player.jumpCharge = 1;
      player.dy = -player.jumpStrength;
    } else if (
      player.jumpCharge > 0 &&
      player.jumpCharge <= player.jumpStrength
    ) {
      player.jumpCharge++;
      player.dy = -player.jumpStrength - player.jumpCharge / 75;
    }
  } else {
    player.jumpCharge = 0;
  }
};

const animate = () => {
  gravity();
  jump();
  clearDrawing();
  drawPlayer();
  drawObstacle();
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);

document.addEventListener("keydown", (e) => {
  keys[e.key as keyof Keys] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key as keyof Keys] = false;
});
