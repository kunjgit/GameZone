var audio = new Audio("./music.mp3");
audio.autoplay = true;
audio.play();
audio.volume = 0.5;
setInterval(() => {
  audio.autoplay = true;
  audio.play();
  audio.volume = 0.5;
}, 120000);

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = "1900";
canvas.height = "885";
c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 1400,
    y: 305,
  },
  imageSrc: "./img/shop.png",
  scale: 3.25,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 100,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "./img/samuraiMack/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 200,
    height: 50,
  },
});
player.draw();

const enemy = new Fighter({
  position: {
    x: 1500,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "./img/kenji/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -250,
      y: 50,
    },
    width: 100,
    height: 50,
  },
});

enemy.draw();
console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  //Objects Rendering
  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  
  //player bound
  if (player.position.x >= 1700) player.position.x = 1700;
  if (player.position.x <= -100) player.position.x = -100;
  //enemy bound
  if (enemy.position.x >= 1750) enemy.position.x = 1750;
  if (enemy.position.x <= 1) enemy.position.x = 1;

  //Player Movement
  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -10;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 10;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //player jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -10;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 10;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }
  //Collision Detection
  //for player collision
  if (
    rectangularCollisions({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    console.log("go");
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  //if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }
  //For enemy collision
  if (
    rectangularCollisions({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
    console.log("enemy go");
  }
  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  //End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      //Player Movement
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.position.y > 250) {
          player.velocity.y = -17;
        }
        console.log(player.position.y);
        break;
      case " ":
        player.attack1();
        break;
      case "f":
        player.attack2();
        break;
    }
  }
  //Enemy Movement
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";

        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";

        break;
      case "ArrowUp":
        if (enemy.position.y > 250) {
          enemy.velocity.y = -17;
        }
        break;
      case "ArrowDown":
        enemy.attack1();
        break;
      case "Control":
        enemy.attack2();
        break;
    }
  }
  addEventListener("keyup", (event) => {
    switch (event.key) {
      case "d":
        keys.d.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      //Enemy Keys
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
    }
    console.log(event);
  });
});
