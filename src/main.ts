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

type Configs = {
  speed: number;
  maxSpeed: number;
  gravityAcceleration: number;
};

type Stats = {
  score: number;
  highScore: number;
};

type Game = {
  player: Player;
  obstacle: Obstacle;
  configs: Configs;
  stats: Stats;
};

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasHeight: number = (canvas.height = window.innerHeight - 10);
const canvasWidth: number = (canvas.width = window.innerWidth - 10);
const keys: Keys = {};

const saveHighScore = (): void => {
  localStorage.setItem(
    "canvasGame.highScore",
    JSON.stringify(game.stats.highScore)
  );
};

const loadHighScore = (): number => {
  const savedHighScore: string | null = localStorage.getItem(
    "canvasGame.highScore"
  );

  if (!savedHighScore) return 0;
  return parseInt(JSON.parse(savedHighScore));
};

const game: Game = {
  player: {
    xPosition: 64,
    yPosition: canvasHeight - 64,
    width: 64,
    height: 64,
    originalHeight: 64,
    color: "black",
    yVelocity: 0,
    jumpHoldFrames: 0,
    jumpVelocity: 16,
    isGrounded: true,
  },
  obstacle: {
    // TODO: Randomize between air and ground obstacle.
    xPosition: canvasWidth,
    yPosition: canvasHeight - 32,
    width: 32,
    height: 32,
    color: "maroon",
  },
  configs: {
    speed: 5,
    maxSpeed: 50,
    gravityAcceleration: 2,
  },
  stats: {
    score: 0,
    highScore: loadHighScore(),
  },
};

const duck = (): void => {
  if (keys["s"] || keys["Control"] || keys["ArrowDown"]) {
    if (game.player.isGrounded) {
      game.player.height = game.player.originalHeight / 2;
      game.player.yPosition = canvasHeight - game.player.height;
    }
  } else {
    game.player.height = game.player.originalHeight;
  }
};

const jump = (): void => {
  if (keys[" "] || keys["w"] || keys["ArrowUp"]) {
    if (game.player.isGrounded && game.player.jumpHoldFrames === 0) {
      game.player.jumpHoldFrames = 1;
      game.player.yVelocity = -game.player.jumpVelocity;
    } else if (
      game.player.jumpHoldFrames > 0 &&
      game.player.jumpHoldFrames <= game.player.jumpVelocity
    ) {
      game.player.jumpHoldFrames++;
      game.player.yVelocity =
        -game.player.jumpVelocity - game.player.jumpHoldFrames / 75;
    }
  } else {
    game.player.jumpHoldFrames = 0;
  }
};

const gravity = (): void => {
  if (
    game.player.yPosition + game.player.height + game.player.yVelocity <
    canvasHeight
  ) {
    game.player.yVelocity += game.configs.gravityAcceleration;
    game.player.yPosition += game.player.yVelocity;
    game.player.isGrounded = false;
  } else {
    game.player.yVelocity = 0;
    game.player.yPosition = canvasHeight - game.player.height;
    game.player.isGrounded = true;
  }
};

const isPlayerCollideWithObstacle = (): boolean => {
  return (
    game.player.xPosition + game.player.width >= game.obstacle.xPosition &&
    game.player.xPosition <= game.obstacle.xPosition + game.obstacle.width &&
    game.player.yPosition + game.player.height >= game.obstacle.yPosition &&
    game.player.yPosition <= game.obstacle.yPosition + game.obstacle.height
  );
};

const isObstacleOffScreen = (): boolean => {
  return (
    game.obstacle.xPosition + game.obstacle.width < canvasWidth - canvasWidth
  );
};

const updateGame = (): void => {
  game.obstacle.xPosition -= game.configs.speed;
  game.stats.score++;

  if (game.configs.speed < game.configs.maxSpeed) {
    game.configs.speed += 0.001;
  } else {
    game.configs.speed = game.configs.maxSpeed;
  }

  if (isPlayerCollideWithObstacle()) {
    if (game.stats.score > game.stats.highScore) {
      game.stats.highScore = game.stats.score;
      saveHighScore();
    }

    game.obstacle.xPosition = canvasWidth;
    game.stats.score = 0;
    game.configs.speed = 5;
  }

  if (isObstacleOffScreen()) {
    game.obstacle.xPosition = canvasWidth;
  }
};

const clearDrawing = (): void => {
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
};

const drawScoreboard = (): void => {
  canvasCtx.fillStyle = "black";
  canvasCtx.font = "1.5rem monospace";
  canvasCtx.fillText(`Score: ${game.stats.score}`, 64, 64);
  canvasCtx.fillText(
    `High Score: ${game.stats.highScore}`,
    canvasWidth - 256,
    64
  );
};

const drawPlayer = (): void => {
  canvasCtx.fillStyle = game.player.color;
  canvasCtx.fillRect(
    game.player.xPosition,
    game.player.yPosition,
    game.player.width,
    game.player.height
  );
};

const drawObstacle = (): void => {
  canvasCtx.fillStyle = game.obstacle.color;
  canvasCtx.fillRect(
    game.obstacle.xPosition,
    game.obstacle.yPosition,
    game.obstacle.width,
    game.obstacle.height
  );
};

const gameLoop = (): void => {
  duck();
  jump();
  gravity();
  updateGame();
  clearDrawing();
  drawScoreboard();
  drawPlayer();
  drawObstacle();
  requestAnimationFrame(gameLoop);
};

document.addEventListener("keydown", (e) => {
  keys[e.key as keyof Keys] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key as keyof Keys] = false;
});

requestAnimationFrame(gameLoop);
