// SKELEATHON JS13KGAMES 2022

// constants
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;
const GROUND_HEIGHT = GAME_HEIGHT / 2 + 150;
const SPELL_COSTS = {
  SPELL: 10,
  RAISE: 20,
};
const MANA_REGEN = 1;
const DIRECTION = {
  LEFT: 1,
  RIGHT: 2,
};
const MELEE_RANGE = 25;
const ITEMS = {
  MANA: 1,
  POWERUP: 2,
  HEAL: 3,
  EXTRA_LIFE: 4,
};
const REST_COUNTDOWN = 10;
const BOSS_FREQUENCY = 5;
const RANDOM_TIPS = [
  "Your skeletons heal after every wave",
  "When you are powered-up your spells will do double the damage",
  "Don't waste your mana"
];

// GAME STATES
const STATES = {
  TITLE: 0,
  RUNNING: 1,
  WIN: 2,
  LOSE: 3,
  PAUSED: 4,
};

// game variables
let accelerationUp = 0.17;
let animShieldMin = -2;
let animShieldMax = 2;
let animShieldInc = 1;
let animShieldValue = 0;
let chatMessages = [];
let corpses = [];
let enemies = [];
let items = [];
let leftIsPressed = false;
let lives = 3;
let loop = 0;
let killCount = 0;
let mana = 100;
let maxLives = 3;
const keyHaveBeenPressedOnce = { // used to display hints
  up: false,
  left: false,
  right: false,
  f: false,
  r: false
};
let particleSystems = [];
let playerX = GAME_WIDTH / 3;
let playerY = GAME_HEIGHT / 2 + 150;
let recoilAcceleration = 0.2;
let recoilSpeed = 0; // recoil movement after being hit
let restCountdown = 0;
let rightIsPressed = false;
let playerDirection = DIRECTION.RIGHT;
let playerIsPoweredUp = false; // gives double shot
let randomTip = RANDOM_TIPS[Math.floor(Math.random() * RANDOM_TIPS.length)];
let skeletons = [];
let speedUp = 0;
const stars = [];
let state = STATES.TITLE;
let waveNumber = 1;

// global time-based checks
let manaLastCheck = Date.now();
let restCountdownLastCheck = Date.now();
let animationLastCheck = Date.now();

// game objects (with initial values)
const generateEnemy = () => ({
  id: Math.random(),
  posX:
    Math.random() < 0.5
      ? -(Math.random() * 300)
      : GAME_WIDTH + Math.random() * 300,
  posY: GROUND_HEIGHT,
  hp: 2,
  maxHP: 2,
  speed: 2,
  attackSpeed: 1000, // 1 per second
  lastAttack: Date.now(),
  recoilSpeed: 0,
  isAttacking: false // used for moving the sword
});

const generateSkeleton = (posX) => ({
  id: Math.random(),
  posX,
  posY: GROUND_HEIGHT,
  hp: 4,
  maxHP: 4,
  speed: 1,
  attackSpeed: 1500,
  lastAttack: Date.now(),
  isAttacking: false
});

const generateRandomItemKind = () => {
  const n = Math.random();
  if (n < 0.5) {
    return ITEMS.MANA;
  } else if (n < 0.8) {
    return lives < maxLives ? ITEMS.HEAL : ITEMS.MANA;
  } else if (n < 0.95) {
    return ITEMS.POWERUP;
  } else if (n >= 0.95) {
    return ITEMS.EXTRA_LIFE;
  }
};

const generateItem = () => ({
  id: Math.random(),
  posX: Math.random() * GAME_WIDTH,
  posY: 10,
  kind: generateRandomItemKind(),
  speedUp: 0,
});

const generateBoss = () => ({
  id: Math.random(),
  posX:
    Math.random() < 0.5
      ? Math.floor(-(Math.random() * 300))
      : Math.floor(GAME_WIDTH + Math.random() * 300),
  posY: GROUND_HEIGHT,
  hp: 8,
  maxHP: 8,
  speed: 1,
  attackSpeed: 1000, // 1 per second
  lastAttack: Date.now(),
  isBoss: true,
  recoilSpeed: 0,
  isAttacking: false,
});

// canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const skeletonGreetings = [
  "Yes, master",
  "Death shall reign",
  "My fate is sealed",
  "You called me?",
  "As you order!",
  "Yes?"
];

const createChatMessage = (text, posX, posY, timeout = 1500) => {
  chatMessages.push({
    id: Math.random(),
    text,
    posX,
    posY,
    creationDate: Date.now(),
    timeout
  });
};

const destroyChatMessage = index => {
  delete chatMessages[index];
  chatMessages = chatMessages.filter((c) => c);
};

const drawMessages = () => {
  chatMessages.forEach((m, index) => {
    ctx.font = "13px arial";
    ctx.fillStyle = "#777777";
    ctx.fillText(m.text, m.posX, m.posY);
    if (Date.now() - m.creationDate > m.timeout) {
      destroyChatMessage(index);
    }
  });
};

const startParticleSystem = (
  id,
  initX,
  initY,
  color = { r: 255, g: 255, b: 255 },
  direction = "up",
  options = {}
) => {
  const particles = [];
  const initTtl = options.initTtl || 50;
  const initSize = options.initSize || 6;
  const maxParticles = options.maxParticles || 10;
  const speed = options.speed || 1;
  const once = options.once || false;
  particles.push({
    x: initX + Math.random() * 10,
    y: initY,
    ttl: initTtl,
    opacity: 1,
    size: initSize,
  });
  particleSystems.push({
    init: {
      color,
      direction,
      id,
      initX,
      initY,
      initTtl,
      initSize,
      maxParticles,
      once,
      speed,
    },
    particles,
  });
};

const updateParticleSystems = () => {
  if (state === STATES.RUNNING || state === STATES.TITLE) {
    particleSystems.forEach((system) => {
      const {
        initX,
        initY,
        initTtl,
        initSize,
        maxParticles,
        color,
        direction,
        speed,
        once,
      } = system.init;
      system.particles.forEach((p, index) => {
        if (!p.dead) {
          let { x, y, size } = p;
          ctx.clearRect(x, y, size, size);
          let newP = { ...p };
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${newP.opacity})`;
          ctx.fillRect(x, y, size, size);
          newP.ttl -= 1;
          if (newP.ttl > 0) {
            if (direction === "up") {
              newP.x += Math.random() * 2 - 1;
              newP.y -= speed;
            } else if (direction === "down") {
              newP.x += Math.random() * 2 - 1;
              newP.y -= -speed;
            } else if (direction === "left") {
              newP.x += -speed;
              newP.y -= Math.random() * 2 - 1;
            } else if (direction === "right") {
              newP.x += speed;
              newP.y -= Math.random() * 2 - 1;
            } else if (direction === "up left") {
              newP.x -= speed / 2;
              newP.y -= speed / 2;
            } else if (direction === "up right") {
              newP.x += speed / 2;
              newP.y -= speed / 2;
            } else if (direction === "down left") {
              newP.x -= speed / 2;
              newP.y += speed / 2;
            } else if (direction === "down right") {
              newP.x += speed / 2;
              newP.y += speed / 2;
            }
            newP.opacity -= 1 / initTtl;
            newP.size -= initSize / initTtl;
          } else if (once) {
            newP.opacity = 0;
            newP.dead = true;
          } else {
            newP.x = initX;
            newP.y = initY;
            newP.ttl = initTtl + Math.floor(Math.random() * 20);
            newP.opacity = 1;
            newP.size = initSize;
          }
          system.particles[index] = newP;
        }
      });
      ctx.fillStyle = "white";
      ctx.shadowColor = "white";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 10;
      ctx.fillRect(initX, initY, 6, 6);
      ctx.shadowBlur = 0;
      if (system.particles.length < maxParticles) {
        system.particles.push({
          x: initX + Math.random() * 10,
          y: initY,
          opacity: 1,
          size: 5,
        });
      }
    });
  }
};

const removeParticleSystem = (index) => {
  delete particleSystems[index];
  particleSystems = particleSystems.filter((e) => e);
};

const removeCorpse = (index) => {
  delete corpses[index];
  corpses = corpses.filter((c) => c);
};

const drawStars = () => {
  let color = "white";
  stars.forEach((s) => {
    ctx.fillStyle = color;
    color = color === "white" ? "gray" : "white";
    ctx.fillRect(s[0], s[1], 2, 2);
  });
};

const drawMoon = () => {
  ctx.beginPath();
  ctx.shadowColor = "white";
  ctx.shadowOffsetX = -7;
  ctx.shadowOffsetY = 7;
  ctx.shadowBlur = 5;
  ctx.arc(100, 100, 50, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#EEEEEE";
  ctx.strokeStyle = "#EEEEEE";
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.arc(110, 90, 45, 0, 2 * Math.PI, false);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
};

const drawPath = () => {
  ctx.beginPath();
  ctx.fillStyle = "#220055";
  ctx.fillRect(0, GAME_HEIGHT / 2 + 100, GAME_WIDTH, 150);
  ctx.fill();
};

const drawTrees = (scroll) => {
  // TODO
};

const drawPlayer = (posX, posY) => {
  const BODY_OFFSET_X = -10;
  const BODY_OFFSET_Y = 15;
  ctx.save();
  // head
  ctx.beginPath();
  if (playerDirection === DIRECTION.LEFT) {
    ctx.translate(posX, posY);
    ctx.rotate(Math.PI);
    ctx.scale(1, -1);
    ctx.translate(-posX, -posY);
  }
  if (recoilSpeed < 0) {
    ctx.translate(posX, posY);
    ctx.rotate(0.1);
    ctx.translate(-posX, -posY);
  } else if (recoilSpeed > 0) {
    ctx.translate(posX, posY);
    ctx.rotate(-0.1);
    ctx.translate(-posX, -posY);
  }
  ctx.fillStyle = "#222222";
  ctx.arc(posX, posY, 20, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(posX + 5, posY + 5, 15, 0, 2 * Math.PI, false);
  ctx.fill();
  // eyes
  ctx.beginPath();
  ctx.fillStyle = particleSystems.length > 3 ? "red" : "green";
  ctx.arc(posX + 2, posY + 5, 2, 0, 2 * Math.PI, false);
  ctx.arc(posX + 9, posY + 5, 2, 0, 2 * Math.PI, false);
  ctx.fill();
  // body
  ctx.beginPath();
  ctx.fillStyle = "#222222";
  ctx.moveTo(posX + BODY_OFFSET_X, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X - 5, posY + BODY_OFFSET_Y + 40);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 40);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 5);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#222222";
  ctx.moveTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 30);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 20);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillRect(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 10, 10, 4);
  // staff
  ctx.fillStyle = "gray";
  ctx.fillRect(posX + BODY_OFFSET_X + 45, posY + BODY_OFFSET_Y, 4, 40);
  ctx.shadowColor = "white";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 10;
  if (playerIsPoweredUp) {
    ctx.fillStyle = "crimson";
  } else {
    ctx.fillStyle = "green";
  }
  ctx.fillRect(posX + BODY_OFFSET_X + 44, posY + BODY_OFFSET_Y, 6, 6);
  // shadow
  ctx.fillStyle = "#222222";
  const blur = speedUp === 0 ? 5 : 15;
  const offset = speedUp === 0 ? 7 : GROUND_HEIGHT - posY;
  ctx.beginPath();
  ctx.ellipse(
    posX + BODY_OFFSET_X + 10,
    posY + BODY_OFFSET_Y + 40,
    10,
    5,
    0,
    0,
    Math.PI,
    true
  );
  ctx.shadowColor = "black";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = offset;
  ctx.shadowBlur = blur;
  ctx.fill();
  ctx.restore();
};

const drawEnemy = (posX, posY, enemyRecoilSpeed, isAttacking) => {
  const BODY_OFFSET_X = -10;
  const BODY_OFFSET_Y = 15;
  ctx.save();
  // head
  ctx.beginPath();
  if (playerX < posX) {
    ctx.translate(posX, posY);
    ctx.rotate(Math.PI);
    ctx.scale(1, -1);
    ctx.translate(-posX, -posY);
  }
  if (enemyRecoilSpeed < 0) {
      ctx.translate(posX, posY);
      ctx.rotate(0.1);
      ctx.translate(-posX, -posY);
    } else if (enemyRecoilSpeed > 0) {
        ctx.translate(posX, posY);
        ctx.rotate(-0.1);
        ctx.translate(-posX, -posY);
      }
        ctx.fillStyle = "#444444";
  ctx.arc(posX, posY, 20, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(posX + 5, posY + 5, 15, 0, 2 * Math.PI, false);
  ctx.fill();
  // eyes
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(posX + 2, posY + 5, 2, 0, 2 * Math.PI, false);
  ctx.arc(posX + 9, posY + 5, 2, 0, 2 * Math.PI, false);
  ctx.fill();
  // body
  ctx.beginPath();
  ctx.fillStyle = "#EEEEEE";
  ctx.moveTo(posX + BODY_OFFSET_X, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X - 5, posY + BODY_OFFSET_Y + 40);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 40);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 5);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#EEEEEE";
  ctx.moveTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 10);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 20);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillRect(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 10, 10, 4);
  // sword
  ctx.save();
  if (isAttacking) {
    if (playerX > posX) {
      ctx.translate(posX, posY);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, 1);
      ctx.translate(-posX - 15, -posY - 55);
    } else {
      ctx.translate(posX, posY);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, 1);
      ctx.translate(-posX - 15, -posY - 55);
    }
  }
  ctx.fillStyle = "gray";
  ctx.fillRect(posX + BODY_OFFSET_X + 45, posY + BODY_OFFSET_Y + 5, 4, -35);
  ctx.fillRect(posX + BODY_OFFSET_X + 46, posY + BODY_OFFSET_Y - 30, 2, -2);
  ctx.fillStyle = "white";
  ctx.fillRect(posX + BODY_OFFSET_X + 45, posY + BODY_OFFSET_Y + 5, 4, 10);
  ctx.fillRect(posX + BODY_OFFSET_X + 38, posY + BODY_OFFSET_Y + 5, 10, 3);
  ctx.fillRect(posX + BODY_OFFSET_X + 46, posY + BODY_OFFSET_Y + 5, 10, 3);
  ctx.restore();
  // shield
  ctx.fillStyle = "crimson";
  ctx.fillRect(posX + BODY_OFFSET_X - 10, posY + BODY_OFFSET_Y + animShieldValue, 20, 30);
  ctx.beginPath();
  ctx.arc(posX + BODY_OFFSET_X, posY + BODY_OFFSET_Y + 30 + animShieldValue, 10, 0, Math.PI);
  ctx.fill();
  ctx.restore();
};

const drawBoss = (posX, posY, isAttacking) => {
  const BODY_OFFSET_X = -10;
  const BODY_OFFSET_Y = 15;
  posY -= 40;
  ctx.save();
  // head
  ctx.beginPath();
  if (playerX < posX) {
    ctx.translate(posX, posY);
    ctx.rotate(Math.PI);
    ctx.scale(1, -1);
    ctx.translate(-posX, -posY);
  }
        ctx.fillStyle = "#444444";
  ctx.arc(posX, posY, 40, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(posX + 5, posY + 5, 30, 0, 2 * Math.PI, false);
  ctx.fill();
  // eyes
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(posX + 2, posY + 5, 4, 0, 2 * Math.PI, false);
  ctx.arc(posX + 11, posY + 5, 4, 0, 2 * Math.PI, false);
  ctx.fill();
  // body
  ctx.beginPath();
  ctx.fillStyle = "#EEEEEE";
  ctx.moveTo(posX + BODY_OFFSET_X, posY + BODY_OFFSET_Y + 10);
  ctx.lineTo(posX + BODY_OFFSET_X - 10, posY + BODY_OFFSET_Y + 80);
  ctx.lineTo(posX + BODY_OFFSET_X + 40, posY + BODY_OFFSET_Y + 80);
  ctx.lineTo(posX + BODY_OFFSET_X + 40, posY + BODY_OFFSET_Y + 10);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#EEEEEE";
  ctx.moveTo(posX + BODY_OFFSET_X + 40, posY + BODY_OFFSET_Y + 10);
  ctx.lineTo(posX + BODY_OFFSET_X + 70, posY + BODY_OFFSET_Y + 10);
  ctx.lineTo(posX + BODY_OFFSET_X + 70, posY + BODY_OFFSET_Y + 20);
  ctx.lineTo(posX + BODY_OFFSET_X + 40, posY + BODY_OFFSET_Y + 40);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillRect(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 10, 20, 8);
  // sword
  ctx.save();
  if (isAttacking) {
    if (playerX > posX) {
      ctx.translate(posX, posY);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, 1);
      ctx.translate(-posX - 15, -posY - 55);
    } else {
      ctx.translate(posX, posY);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, 1);
      ctx.translate(-posX - 15, -posY - 55);
    }
  }
  ctx.fillStyle = "gray";
  ctx.fillRect(posX + BODY_OFFSET_X + 60, posY + BODY_OFFSET_Y + 5, 8, -70);
  ctx.fillRect(posX + BODY_OFFSET_X + 61, posY + BODY_OFFSET_Y - 64, 6, -4);
  ctx.fillRect(posX + BODY_OFFSET_X + 62, posY + BODY_OFFSET_Y - 68, 4, -4);
  ctx.fillStyle = "white";
  ctx.fillRect(posX + BODY_OFFSET_X + 60, posY + BODY_OFFSET_Y + 5, 8, 20);
  ctx.fillRect(posX + BODY_OFFSET_X + 53, posY + BODY_OFFSET_Y + 5, 20, 6);
  ctx.fillRect(posX + BODY_OFFSET_X + 61, posY + BODY_OFFSET_Y + 5, 20, 6);
  ctx.restore();
  // shield
  ctx.fillStyle = "brown";
  ctx.fillRect(posX + BODY_OFFSET_X - 10, posY + BODY_OFFSET_Y + 10 + animShieldValue, 40, 60);
  ctx.beginPath();
  ctx.arc(posX + BODY_OFFSET_X + 10, posY + BODY_OFFSET_Y + 70 + animShieldValue, 20, 0, Math.PI);
  ctx.fill();
  ctx.restore();
};

const drawSkeleton = (posX, posY, isAttacking) => {
  const BODY_OFFSET_X = -10;
  const BODY_OFFSET_Y = 15;
  ctx.save();
  // head
  ctx.beginPath();
  if (playerX > posX || playerX < posX && enemies.length === 0) {
    ctx.translate(posX, posY);
    ctx.rotate(Math.PI);
    ctx.scale(1, -1);
    ctx.translate(-posX, -posY);
  }

  ctx.beginPath();
  ctx.fillStyle = "#CCCCCC";
  ctx.fillRect(posX - 2, posY, 20, 20);
  ctx.fill();
  // eyes
  ctx.fillStyle = "black";
  ctx.fillRect(posX + 1, posY + 5, 5, 5);
  ctx.fillRect(posX + 12, posY + 5, 5, 5);
  // skull details
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(posX + 3, posY + 15, 3, 5);
  ctx.fillRect(posX + 7, posY + 15, 3, 5);
  ctx.fillRect(posX + 11, posY + 15, 3, 5);
  ctx.fill();
  // body
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.moveTo(posX + BODY_OFFSET_X, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X - 5, posY + BODY_OFFSET_Y + 40);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 40);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 5);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.moveTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 5);
  ctx.lineTo(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 10);
  ctx.lineTo(posX + BODY_OFFSET_X + 20, posY + BODY_OFFSET_Y + 20);
  ctx.fill();
  ctx.fillStyle = "#CCCCCC";
  ctx.fillRect(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 10, 10, 4);
  // sword
  ctx.save();
  if (isAttacking) {
    if (playerX > posX) {
      ctx.translate(posX, posY);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, 1);
      ctx.translate(-posX - 15, -posY - 55);
    } else {
      ctx.translate(posX, posY);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, 1);
      ctx.translate(-posX - 15, -posY - 55);
    }
  }
  ctx.fillStyle = "gray";
  ctx.fillRect(posX + BODY_OFFSET_X + 45, posY + BODY_OFFSET_Y + 5, 4, -35);
  ctx.fillRect(posX + BODY_OFFSET_X + 46, posY + BODY_OFFSET_Y - 30, 2, -2);
  ctx.fillStyle = "white";
  ctx.fillRect(posX + BODY_OFFSET_X + 45, posY + BODY_OFFSET_Y + 5, 4, 10);
  ctx.fillRect(posX + BODY_OFFSET_X + 38, posY + BODY_OFFSET_Y + 5, 10, 3);
  ctx.fillRect(posX + BODY_OFFSET_X + 46, posY + BODY_OFFSET_Y + 5, 10, 3);
  ctx.restore();
  // shadow
  ctx.fillStyle = "#222222";
  const blur = 5;
  const offset = 7;
  ctx.beginPath();
  ctx.ellipse(
    posX + BODY_OFFSET_X + 10,
    posY + BODY_OFFSET_Y + 40,
    10,
    5,
    0,
    0,
    Math.PI,
    true
  );
  ctx.shadowColor = "black";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = offset;
  ctx.shadowBlur = blur;
  ctx.fill();
  ctx.restore();
};

const drawBigSkeleton = (posX, posY, isAttacking) => {
  const BODY_OFFSET_X = -10;
  const BODY_OFFSET_Y = 15;
  posY -= 40;
  ctx.save();
  // head
  ctx.beginPath();
  if (playerX > posX || playerX < posX && enemies.length === 0) {
    ctx.translate(posX, posY);
    ctx.rotate(Math.PI);
    ctx.scale(1, -1);
    ctx.translate(-posX, -posY);
  }
      ctx.beginPath();
      ctx.fillStyle = "#CCCCCC";
      ctx.fillRect(posX - 10, posY - 20, 40, 40);
      ctx.fill();
      // eyes
      ctx.fillStyle = "black";
      ctx.fillRect(posX + 1, posY -10, 10, 10);
      ctx.fillRect(posX + 15, posY -10, 10, 10);
      // skull details
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.fillRect(posX + 3, posY + 15, 4, 5);
      ctx.fillRect(posX + 9, posY + 15, 4, 5);
      ctx.fillRect(posX + 15, posY + 15, 4, 5);
      ctx.fill();
  // body
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.moveTo(posX + BODY_OFFSET_X, posY + BODY_OFFSET_Y + 10);
  ctx.lineTo(posX + BODY_OFFSET_X - 10, posY + BODY_OFFSET_Y + 80);
  ctx.lineTo(posX + BODY_OFFSET_X + 40, posY + BODY_OFFSET_Y + 80);
  ctx.lineTo(posX + BODY_OFFSET_X + 40, posY + BODY_OFFSET_Y + 10);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.moveTo(posX + BODY_OFFSET_X + 40, posY + BODY_OFFSET_Y + 10);
  ctx.lineTo(posX + BODY_OFFSET_X + 70, posY + BODY_OFFSET_Y + 10);
  ctx.lineTo(posX + BODY_OFFSET_X + 70, posY + BODY_OFFSET_Y + 20);
  ctx.lineTo(posX + BODY_OFFSET_X + 40, posY + BODY_OFFSET_Y + 40);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillRect(posX + BODY_OFFSET_X + 35, posY + BODY_OFFSET_Y + 10, 20, 8);
  // sword
  ctx.save();
  if (isAttacking) {
    if (playerX > posX) {
      ctx.translate(posX, posY);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, 1);
      ctx.translate(-posX - 15, -posY - 55);
    } else {
      ctx.translate(posX, posY);
      ctx.rotate(Math.PI / 2);
      ctx.scale(1, 1);
      ctx.translate(-posX - 15, -posY - 55);
    }
  }
  ctx.fillStyle = "gray";
  ctx.fillRect(posX + BODY_OFFSET_X + 60, posY + BODY_OFFSET_Y + 5, 8, -70);
  ctx.fillRect(posX + BODY_OFFSET_X + 61, posY + BODY_OFFSET_Y - 64, 6, -4);
  ctx.fillRect(posX + BODY_OFFSET_X + 62, posY + BODY_OFFSET_Y - 68, 4, -4);
  ctx.fillStyle = "white";
  ctx.fillRect(posX + BODY_OFFSET_X + 60, posY + BODY_OFFSET_Y + 5, 8, 20);
  ctx.fillRect(posX + BODY_OFFSET_X + 53, posY + BODY_OFFSET_Y + 5, 20, 6);
  ctx.fillRect(posX + BODY_OFFSET_X + 61, posY + BODY_OFFSET_Y + 5, 20, 6);
  ctx.restore();
  ctx.restore();
};

const generateStarBackground = (numberOfStars) => {
  while (numberOfStars--) {
    const x = Math.floor(Math.random() * GAME_WIDTH);
    const y = Math.floor((Math.random() * (GAME_HEIGHT - 200)));
    stars.push([x, y]);
  }
};

// make objets fall
const updateGravity = () => {
  if (speedUp !== 0) {
    playerY -= speedUp;
    speedUp -= accelerationUp;
  }
  if (playerY > GROUND_HEIGHT) {
    speedUp = 0;
    playerY = GROUND_HEIGHT;
  }
  if (items?.length > 0) {
    items.forEach((item) => {
      item.posY += item.speedUp;
      item.speedUp += accelerationUp;
      if (item.posY > GROUND_HEIGHT) {
        item.speedUp = 0;
        item.posY = GROUND_HEIGHT;
      }
    });
  }
};

// make player recoil (when hit)
const updateRecoil = () => {
  if (recoilSpeed !== 0) {
    playerX += recoilSpeed;
    recoilSpeed =
      recoilSpeed > 0
        ? recoilSpeed - recoilAcceleration
        : recoilSpeed + recoilAcceleration;
  }
  if (recoilSpeed < 0.2 && recoilSpeed > -0.2) {
    recoilSpeed = 0;
  }
  // enemies
  enemies.forEach(e => {
    if (e.recoilSpeed !== 0) {
      e.posX += e.recoilSpeed;
      e.recoilSpeed =
        e.recoilSpeed > 0
          ? e.recoilSpeed - recoilAcceleration
          : e.recoilSpeed + recoilAcceleration;
    }
    if (e.recoilSpeed < 0.2 && e.recoilSpeed > -0.2) {
      e.recoilSpeed = 0;
    }
  })
};

// move player to the sides
const movePlayer = () => {
  if (leftIsPressed && playerX > 20) {
    playerX -= 5;
  } else if (rightIsPressed && playerX < GAME_WIDTH - 20) {
    playerX += 5;
  }
};

const shot = () => {
  if (mana >= SPELL_COSTS.SPELL) {
    mana -= SPELL_COSTS.SPELL;
    startParticleSystem(
      particleSystems.length,
      playerDirection === DIRECTION.LEFT ? playerX - 35 : playerX + 35,
      playerY + 15,
      { r: 0, g: 255, b: 0 },
      playerDirection === DIRECTION.LEFT ? "right" : "left",
      {
        initTtl: 50,
        speed: 0.7,
        maxParticles: 40,
      }
    );
    if (playerIsPoweredUp) {
      startParticleSystem(
        particleSystems.length,
        playerDirection === DIRECTION.LEFT ? playerX - 37 : playerX + 37,
        playerY + 5,
        { r: 0, g: 255, b: 0 },
        playerDirection === DIRECTION.LEFT ? "right" : "left",
        {
          initTtl: 50,
          speed: 0.7,
          maxParticles: 40,
        }
      );
    }
  }
};

const updateShots = () => {
  particleSystems.forEach((p, index) => {
    if (p.init.direction === "left") {
      p.init.initX += 6;
    } else if (p.init.direction === "right") {
      p.init.initX -= 6;
    }
    if (p.init.initX > GAME_WIDTH || p.init.initX < 0) {
      removeParticleSystem(index);
    }
  });
};

const spawnEnemies = (number) => {
  for (let i = 0; i < number; i++) {
    enemies.push(generateEnemy());
  }
};

const spawnBoss = () => {
  enemies.push(generateBoss());
};

const spawnItems = (number) => {
  for (let i = 0; i < number; i++) {
    items.push(generateItem());
  }
};

const randomDrop = (posX, posY, isBoss) => {
  if (isBoss) {
    if (Math.random() < 0.5) {
      items.push({
        id: Math.random(),
        posX: posX + 10,
        posY: posY - 100,
        kind: ITEMS.MANA,
        speedUp: -2,
      })
    }
    if (Math.random() < 0.5) {
      items.push({
        id: Math.random(),
        posX,
        posY: posY - 10,
        kind: ITEMS.HEAL,
        speedUp: -2,
      })
    }
  } else {
    if (Math.random() < 0.2) {
      items.push({
        id: Math.random(),
        posX,
        posY: posY - 100,
        kind: ITEMS.MANA,
        speedUp: -2,
      })
    }
  }
};

const killEnemy = (enemyId) => {
  enemies.forEach((e, index) => {
    if (e.id === enemyId) {
      corpses.push({
        posX: e.posX,
        posY: e.posY,
        isBoss: e.isBoss
      });
      randomDrop(e.posX, e.posY, e.isBoss);
      delete enemies[index];
    }
  });
  enemies = enemies.filter((e) => e);
  killCount += 1;
};

const raiseSkeleton = () => {
  if (mana >= SPELL_COSTS.RAISE) {
    let raised;
    corpses.forEach((corpse, index) => {
      if (Math.abs(playerX - corpse.posX) < 15) {
        raised = { corpse, index };
      }
    });
    if (raised) {
      const skeleton = generateSkeleton(raised.corpse.posX);
      skeleton.isBoss = raised.corpse.isBoss;
      if (skeleton.isBoss) {
        skeleton.hp = 7;
        skeleton.maxHP = 7;
      }
      skeletons.push(skeleton);
      removeCorpse(raised.index);
      mana -= SPELL_COSTS.RAISE;
      createChatMessage(skeletonGreetings[Math.floor(Math.random() * skeletonGreetings.length)], skeleton.posX, skeleton.posY - 20);
    }
  }
};

const destroySkeleton = (skeletonId) => {
  delete skeletons[skeletons.findIndex((s) => s.id === skeletonId)];
  skeletons = skeletons.filter((s) => s);
};

const destroyItem = (itemId) => {
  delete items[items.findIndex((s) => s.id === itemId)];
  items = items.filter((s) => s);
};

const initWave = () => {
  skeletons.forEach(s => {
    s.hp = s.maxHP;
  });
  if (waveNumber % BOSS_FREQUENCY === 0) {
    spawnEnemies(waveNumber - 1);
    spawnBoss();
  } else {
    spawnEnemies(waveNumber);
  }
};

const initRest = () => {
  restCountdown = REST_COUNTDOWN;
  spawnItems(Math.floor(Math.random() * 5));
  playerIsPoweredUp = false;
};

// run AI
const AIStep = () => {
  const now = Date.now();
  enemies.forEach((enemy) => {
    const target = skeletons.find(
      (s) => Math.abs(s.posX - enemy.posX) < MELEE_RANGE
    );
    const playerContact =
      Math.abs(playerX - enemy.posX) < MELEE_RANGE &&
      Math.abs(playerY - enemy.posY) < MELEE_RANGE;
    if (target) {
      if (now - enemy.lastAttack > enemy.attackSpeed) {
        enemy.lastAttack = now;
        target.hp -= 1;
        enemy.isAttacking = true;
        if (target.hp <= 0) {
          destroySkeleton(target.id);
        }
      }
    } else if (playerContact) {
      if (now - enemy.lastAttack > enemy.attackSpeed) {
        enemy.lastAttack = now;
        lives -= 1;
        enemy.isAttacking = true;
        recoilSpeed = playerX < enemy.posX ? -7 : 7;
        if (lives <= 0) {
          state = STATES.LOSE;
        }
      }
    } else {
      if (enemy.posX > playerX) {
        enemy.posX -= enemy.speed;
      } else {
        enemy.posX += enemy.speed;
      }
    }
  });
  skeletons.forEach((skeleton) => {
    const target = enemies.find((e) => Math.abs(e.posX - skeleton.posX) < 15);
    if (target) {
      if (now - skeleton.lastAttack > skeleton.attackSpeed) {
        skeleton.lastAttack = now;
        target.hp -= 1;
        skeleton.isAttacking = true;
        target.recoilSpeed = skeleton.posX < target.posX ? 7 : -7;
        if (target.hp <= 0) {
          killEnemy(target.id);
        }
      }
    } else {
      if (skeleton.posX > playerX && enemies.length > 0) {
        skeleton.posX += skeleton.speed;
      } else if (skeleton.posX > playerX && enemies.length === 0) {
        skeleton.posX -= skeleton.speed;
      } else if (skeleton.posX < playerX && enemies.length > 0) {
        skeleton.posX -= skeleton.speed;
      } else if (skeleton.posX < playerX && enemies.length === 0) {
        skeleton.posX += skeleton.speed;
      }
    }
  });
};

const drawEnemies = () => {
  enemies.forEach((enemy) => {
    if (enemy.isBoss) {
      drawBoss(enemy.posX, GROUND_HEIGHT, enemy.isAttacking);
    } else {
      drawEnemy(enemy.posX, GROUND_HEIGHT, enemy.recoilSpeed, enemy.isAttacking);
    }
  });
};

const drawCorpses = () => {
  corpses.forEach((corpse) => {
    ctx.fillStyle = "gray";
    ctx.fillRect(corpse.posX - 20, GROUND_HEIGHT + 45, 40, 5);
    ctx.fillRect(corpse.posX - 10, GROUND_HEIGHT + 45, 20, -20);
    ctx.beginPath();
    ctx.fillStyle = "gray";
    ctx.arc(corpse.posX, GROUND_HEIGHT + 25, 10, 0, Math.PI, true);
    ctx.fill();
    ctx.font = "10px arial";
    ctx.fillStyle = "black";
    ctx.fillText("RIP", corpse.posX - 8, corpse.posY + 35);
  });
};

const drawSkeletons = () => {
  skeletons.forEach((skeleton) => {
    if (skeleton.isBoss) {
      drawBigSkeleton(skeleton.posX, GROUND_HEIGHT, skeleton.isAttacking);
    } else {
      drawSkeleton(skeleton.posX, GROUND_HEIGHT, skeleton.isAttacking);
    }
  });
};

const drawItems = () => {
  items.forEach((item) => {
    switch (item.kind) {
      case ITEMS.MANA:
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.arc(item.posX, item.posY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#DDDDFF";
        ctx.arc(item.posX, item.posY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#AAAAFF";
        ctx.arc(item.posX, item.posY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#8888FF";
        ctx.arc(item.posX, item.posY, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
      case ITEMS.HEAL:
        drawHearth(item.posX, item.posY, 0.15, true, "pink");
        break;
        case ITEMS.POWERUP:
          ctx.fillStyle = "green";
          ctx.fillRect(item.posX, item.posY, 27, 20);
          ctx.font = "10px arial";
          ctx.fillStyle = "white";
          ctx.fillText("POW", item.posX + 2, item.posY + 12);
          break;
          case ITEMS.EXTRA_LIFE:
            drawHearth(item.posX, item.posY, 0.2, true);
        break;
    }
  });
};

const drawHearth = (x, y, scale = 0.2, isFull, fillColor) => {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.fillStyle = fillColor || "crimson";
  ctx.strokeStyle = "crimson";
  ctx.lineWidth = 3;
  const posX = x / scale;
  const posY = y / scale;
  ctx.moveTo(posX, posY); // 75 40
  ctx.bezierCurveTo(posX, posY - 3, posX - 5, posY - 15, posX - 25, posY - 15);
  ctx.bezierCurveTo(
    posX - 55,
    posY - 15,
    posX - 55,
    posY + 22.5,
    posX - 55,
    posY + 22.5
  );
  ctx.bezierCurveTo(
    posX - 55,
    posY + 40,
    posX - 35,
    posY + 62,
    posX,
    posY + 80
  );
  ctx.bezierCurveTo(
    posX + 35,
    posY + 62,
    posX + 55,
    posY + 40,
    posX + 55,
    posY + 22.5
  );
  ctx.bezierCurveTo(
    posX + 55,
    posY + 22.5,
    posX + 55,
    posY - 15,
    posX + 25,
    posY - 15
  );
  ctx.bezierCurveTo(posX + 10, posY - 15, posX, posY - 3, posX, posY);
  if (isFull) {
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();
};

const drawGameOver = () => {
  ctx.fillStyle = "rgba(100, 0, 0, 0.6)";
  ctx.fillRect(0, 300, GAME_WIDTH, 200);
  ctx.font = "24px arial";
  ctx.fillStyle = "black";
  ctx.fillText("You died", GAME_WIDTH / 2 - 20, 420);
  ctx.font = "18px arial";
  ctx.fillStyle = "#111111";
  ctx.fillText("Press any key", GAME_WIDTH / 2 - 20, 480);
}

const drawUI = () => {
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, GAME_HEIGHT - 130, GAME_WIDTH, GAME_HEIGHT);
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.strokeStyle = "deepskyblue";
  ctx.fillRect(50, GAME_HEIGHT - 100, mana, 20);
  ctx.strokeRect(50, GAME_HEIGHT - 100, 100, 20);
  ctx.fill();
  ctx.stroke();
  for (let i = 1; i < maxLives + 1; i++) {
    drawHearth(30 + 30 * i, GAME_HEIGHT - 120, 0.2, i <= lives);
  }
  if (enemies.length === 0) {
    ctx.font = "48px serif";
    ctx.fillStyle = "white";
    ctx.fillText(restCountdown, GAME_WIDTH - 50, GAME_HEIGHT - 50);
  } else {
    ctx.font = "24px serif";
    ctx.fillStyle = "deepskyblue";
    if (waveNumber % BOSS_FREQUENCY === 0) {
      ctx.fillText('Boss', GAME_WIDTH - 100, GAME_HEIGHT - 50);
    } else {
      ctx.fillText(`Wave ${waveNumber}`, GAME_WIDTH - 100, GAME_HEIGHT - 50);

    }
  }
  ctx.font = "24px serif";
  ctx.fillStyle = "white";
  ctx.fillText(`Kills: ${killCount}`, 50, GAME_HEIGHT - 50);
};

const drawHints = () => {
  // arrow up
  if (!keyHaveBeenPressedOnce.up) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(playerX - 15, playerY - 80, 50, 50);
    ctx.font = "12px serif";
    ctx.fillStyle = "blue";
    ctx.fillText("up (jump)", playerX - 14, playerY - 50);
  }
  if (!keyHaveBeenPressedOnce.left) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(playerX - 80, playerY, 50, 50);
    ctx.fillStyle = "blue";
    ctx.font = "16px serif";
    ctx.fillText("left", playerX - 70, playerY + 30);
  }
  if (!keyHaveBeenPressedOnce.right) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(playerX + 50, playerY, 50, 50);
    ctx.fillStyle = "blue";
    ctx.font = "16px serif";
    ctx.fillText("right", playerX + 60, playerY + 30);
  }
  if (!keyHaveBeenPressedOnce.f) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(playerX - 15, playerY + 80, 50, 50);
    ctx.fillStyle = "green";
    ctx.font = "12px serif";
    ctx.fillText("f (fire)", playerX - 10, playerY + 110);
  }
  // raise undead
  if (corpses.length === 1) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(corpses[0].posX - 20, corpses[0].posY - 60, 50, 50);
    ctx.font = "16px serif";
    ctx.fillStyle = "black";
    ctx.fillText("r", corpses[0].posX + 5, corpses[0].posY - 40);
    ctx.fillText("(raise)", corpses[0].posX - 15, corpses[0].posY - 30);
  }
}

const checkColisions = () => {
  particleSystems.forEach((p, index) => {
    const enemy = enemies.find(
      (e) =>
        Math.abs(e.posX - p.init.initX) < 30 &&
        Math.abs(e.posY - p.init.initY) < 30
    );
    if (enemy) {
      enemy.hp -= 1;
      removeParticleSystem(index);
      enemy.recoilSpeed = playerX < enemy.posX ? 7 : -7;
      if(enemy.hp === 0) {
        killEnemy(enemy.id);
      }
    }
  });
  items.forEach((item) => {
    if (
      Math.abs(item.posX - playerX) < 30 &&
      Math.abs(item.posY - playerY) < 30
    ) {
      if (item.kind === ITEMS.MANA) {
        mana = Math.min(100, mana + 10);
      } else if (item.kind === ITEMS.HEAL && lives < maxLives) {
        lives += 1;
      } else if (item.kind === ITEMS.POWERUP && !playerIsPoweredUp) {
        playerIsPoweredUp = true;
      } else if (item.kind === ITEMS.EXTRA_LIFE) {
        maxLives += 1;
        lives += 1;
      }
      destroyItem(item.id);
    }
  });
};

const initInteraction = () => {
  document.addEventListener("keydown", (ev) => {
    if (state === STATES.RUNNING) {
      switch (ev.key) {
        // arrows
        case "ArrowLeft":
          playerDirection = DIRECTION.LEFT;
          leftIsPressed = true;
          rightIsPressed = false;
          keyHaveBeenPressedOnce.left = true;
          break;
          case "ArrowUp":
            if (speedUp === 0) {
              speedUp = 6;
            }
            keyHaveBeenPressedOnce.up = true;
            break;
            case "ArrowRight":
              playerDirection = DIRECTION.RIGHT;
              rightIsPressed = true;
              leftIsPressed = false;
              keyHaveBeenPressedOnce.right = true;
              break;
              case "f":
          shot();
          keyHaveBeenPressedOnce.f = true;
          break;
          case "r":
            raiseSkeleton();
            keyHaveBeenPressedOnce.r = true;
          break;
        case "p":
          state = STATES.PAUSED;
          break;
      }
    } else if (state === STATES.LOSE) {
      location.reload();
    } else if (state === STATES.TITLE) {
      state = STATES.RUNNING;
      playerX = GAME_WIDTH / 3;
    } else if (state === STATES.PAUSED) {
      switch (ev.key) {
        case "p":
          state = STATES.RUNNING;
          break;
      }
    }
  });
  document.addEventListener("keyup", (ev) => {
    if (state === STATES.RUNNING) {
      switch (ev.keyCode) {
        case 37:
        case 39:
          leftIsPressed = false;
          rightIsPressed = false;
          break;
      }
    }
  });
};

const drawTitle = () => {
  // upper section
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 50, canvas.width, 250);
  ctx.fillStyle = "green";
  ctx.font = "80px Arial";
  ctx.fillText("SKELEATHON", 250, 150);
  playerX = 0;
  drawPlayer(100, 200);
  drawSkeleton(180, 200);
  drawSkeleton(220, 200);
  drawSkeleton(250, 200);
  drawSkeleton(350, 200, true);
  drawEnemy(650, 200);
  drawEnemy(750, 200);
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";
  ctx.fillText("Developed by Durgesh4993", 460, 290);
  // bottom section
  ctx.strokeStyle = "white";
  ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
  ctx.strokeRect(10, 350, canvas.width - 20, 240);
  ctx.fillRect(10, 350, canvas.width - 20, 240);
  // Introduction
  ctx.fillStyle = "white";
  ctx.fillText(
    "You are a necromancer.",
    20,
    370
  );
  ctx.fillText(
    "Forces of good want to destroy you. But nobody will stop your dark plans...",
    20,
    390
  );
  ctx.fillText(
    "Use arrows to move and jump. Use F to fire your deadly magic. Use R near a grave to raise a skeleton.",
    20,
    430
  );
  ctx.fillText("The game never ends... how many waves are you able to survive?", 20, 450);
  ctx.fillText(
    "Press any key to start",
    canvas.width - 150,
    canvas.height - 20
  );
  ctx.fillText("Random tip: " + randomTip, 20, 570);
};

const gameLoop = () => {
  if (state === STATES.TITLE) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawTitle();
  } else if (state === STATES.LOSE) {
    // draw game over overlay
    drawGameOver();
  } else {
    if (loop % 2 === 0 && state === STATES.RUNNING) {
      AIStep();
      checkColisions();
      if (enemies.length === 0 && restCountdown === 0) {
        initRest();
      }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawMoon();
    drawPath();
    drawTrees();
    drawCorpses();
    drawPlayer(playerX, playerY);
    updateGravity();
    updateRecoil();
    movePlayer();
    updateShots();
    drawEnemies();
    drawSkeletons();
    drawItems();
    drawMessages();
    drawUI();
    drawHints();
    // updateLandingProgress();
  }
  updateParticleSystems();
  if (loop % 20 === 0) {
    // mana increment
    const now = Date.now();
    if (now - manaLastCheck > 1000 && mana < 100) {
      mana += 1;
      manaLastCheck = now;
    }
    // countdown
    if (enemies.length === 0 && now - restCountdownLastCheck > 1000) {
      restCountdown -= 1;
      restCountdownLastCheck = now;
      if (restCountdown === 0) {
        items = [];
        waveNumber += 1;
        initWave();
      }
    }
    enemies.forEach(e => {
      e.isAttacking = false;
    });    
    skeletons.forEach(s => {
      s.isAttacking = false;
    });
  }
  if (loop % 3 === 0) {
    const now = Date.now();
    // animations
    if (now - animationLastCheck > 100) {
      animationLastCheck = now;
      animShieldValue += animShieldInc;
      if (animShieldValue > animShieldMax || animShieldValue < animShieldMin) {
        animShieldInc = -animShieldInc;
      }
    }
  }
  loop++;
  window.requestAnimationFrame(gameLoop);
};

const initGame = () => {
  generateStarBackground(200);
  initInteraction();
  play();
  window.requestAnimationFrame(gameLoop);
};

const play = () => {
  initWave();
};

window.addEventListener("load", () => {
  initGame();
});
