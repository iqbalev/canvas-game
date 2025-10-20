const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasHeight = (canvas.height = window.innerHeight - 10);
const canvasWidth = (canvas.width = window.innerWidth - 10);

const player = {
  h: 64,
  w: 64,
  x: 0,
  y: canvasHeight - 64,
  c: "black",
};

const obstacle = {
  h: 64,
  w: 64,
  x: canvasWidth - 64,
  y: canvasHeight - 64 - 48, // TODO: Randomize between air and ground obstacle.
  c: "red",
};

const drawPlayer = () => {
  canvasCtx.fillStyle = player.c;
  canvasCtx.fillRect(player.x, player.y, player.w, player.h);
};

const drawObstacle = () => {
  canvasCtx.fillStyle = obstacle.c;
  canvasCtx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
};

drawPlayer();
drawObstacle();
