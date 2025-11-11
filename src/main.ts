type Keys = {
  ArrowUp?: boolean;
  ArrowDown?: boolean;
  w?: boolean;
  s?: boolean;
  Enter?: boolean;
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
  isDead: boolean;
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

let animationFrame: number;

const LOCAL_STORAGE_KEY: string = "canvasGame.highScore";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasHeight: number = (canvas.height = window.innerHeight - 10);
const canvasWidth: number = (canvas.width = window.innerWidth - 10);
const keys: Keys = {};

const saveHighScore = (): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, game.stats.highScore.toFixed(0));
};

const loadHighScore = (): number => {
  const savedHighScore: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!savedHighScore) return 0;
  return parseInt(JSON.parse(savedHighScore));
};

const getRandomIndexFromArray = (array: number[] | string[]): number => {
  return Math.floor(Math.random() * array.length);
};

const generateRandomObstacle = (): Obstacle => {
  const positions: number[] = [360, 400, 440, 480];
  const dimensions: number[] = [16, 24, 32, 48, 64];
  const colors: string[] = [
    "#FF6347",
    "#FFD1C1",
    "#FFA07A",
    "#FF4500",
    "#F08080",
    "#FFE4E1",
    "#8B0000",
    "#F5DEB3",
    "#FFB6C1",
    "#D2691E",
    "#CD5C5C",
  ];

  let randomPositionIndex: number = getRandomIndexFromArray(positions);
  let randomWidthIndex: number = getRandomIndexFromArray(dimensions);
  let randomHeightIndex: number = getRandomIndexFromArray(dimensions);
  let randomColorIndex: number = getRandomIndexFromArray(colors);

  let color: string = colors[randomColorIndex];
  let height: number = dimensions[randomHeightIndex];
  let width: number = dimensions[randomWidthIndex];
  let yPosition: number = positions[randomPositionIndex];
  let newYPosition = yPosition;

  // This will prevent the obstacle being drowned.
  if (newYPosition === 480) {
    newYPosition = canvasHeight - height - 1;
  } else {
    newYPosition = yPosition - 1;
  }

  return {
    xPosition: canvasWidth,
    yPosition: newYPosition,
    width,
    height,
    color,
  };
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
    isDead: false,
  },
  obstacle: generateRandomObstacle(),
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
      // TODO: Reduce jump velocity if the player is ducking.
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
  game.stats.score = game.stats.score + 0.1;

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

    game.player.isDead = true;
  }

  if (isObstacleOffScreen(game)) {
    game.obstacle = generateRandomObstacle();
  }
};

const resetGame = (): void => {
  if (keys["Enter"] && game.player.isDead) {
    game.player.isDead = false;
    game.obstacle = generateRandomObstacle();
    game.configs.speed = 5;
    game.stats.score = 0;
    animationFrame = requestAnimationFrame(gameLoop);
  }
};

const clearDrawing = (): void => {
  canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
};

const drawScoreboard = (): void => {
  canvasCtx.fillStyle = "black";
  canvasCtx.font = "1.5rem monospace";
  canvasCtx.fillText(`Score: ${game.stats.score.toFixed(0)}`, 64, 64);
  canvasCtx.fillText(
    `High Score: ${game.stats.highScore.toFixed(0)}`,
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

const drawGameOverScreen = (): void => {
  canvasCtx.fillStyle = "black";
  canvasCtx.font = "3rem monospace";
  canvasCtx.fillText("Game Over", canvasWidth / 2 - 128, canvasHeight / 2);
  canvasCtx.font = "1.25rem monospace";
  canvasCtx.fillText(
    "Press 'Enter' to play again",
    canvasWidth / 2 - 128,
    canvasHeight / 2 + 32
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

  if (game.player.isDead) {
    drawGameOverScreen();
    cancelAnimationFrame(animationFrame);
  } else {
    animationFrame = requestAnimationFrame(gameLoop);
  }
};

document.addEventListener("keydown", (e) => {
  keys[e.key as keyof Keys] = true;
  resetGame(); // Triggered by 'Enter' after the player dies.
});

document.addEventListener("keyup", (e) => {
  keys[e.key as keyof Keys] = false;
});

animationFrame = requestAnimationFrame(gameLoop);
