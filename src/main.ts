const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasHeight = (canvas.height = window.innerHeight - 10);
const canvasWidth = (canvas.width = window.innerWidth - 10);

let gravityStrength = 1;

const player = {
  x: 0,
  // y: canvasHeight - 64,
  y: 0, // TODO: Revert to the line above later.
  h: 64,
  w: 64,
  c: "black",
  dy: 0,
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

const animate = () => {
  gravity();
  clearDrawing();
  drawPlayer();
  drawObstacle();
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
