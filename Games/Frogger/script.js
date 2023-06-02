const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// width and height of canvas
const width = 800;
const height = 630;

//image sources
const frog_src =
  "https://art.pixilart.com/6c1e8362e1d08f8.png";
const car_src =
  "https://b.kisscc0.com/20180705/siw/kisscc0-sports-car-pink-racing-truck-auto-racing-pink-racing-car-top-view-5b3e41163c4a34.976753331530806550247.png";
const log_src =
  "https://cdn.pixabay.com/photo/2016/10/23/16/46/wood-1763498_960_720.png";
const line_height = 70;

var moveSound = new Audio("assets/move.wav");
var collisionSound = new Audio("assets/collision.wav");
var winSound = new Audio("assets/winner.wav");
let started = false;

// class for frog
class Frog {
  constructor() {
    this.x = 400;
    this.y = 560;
    this.speed = 0;
    this.image = new Image(50, 70);
    this.image.src = frog_src;
  }
  draw() {
    context.drawImage(
      this.image,
      this.x,
      this.y,
      this.image.width,
      this.image.height
    );
    canvas.style.zIndex = 10;
  }
  update() {
    this.draw();
    this.x += this.speed;
    if (this.x > width) {
      resetGame();
      // this.x = -this.image.width;
    }
  }
}

// class for cars
class Car {
  constructor(x, y, speed) {
    this.image = new Image(100, 70);
    this.image.src = car_src;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  draw() {
    context.drawImage(
      this.image,
      this.x,
      this.y,
      this.image.width,
      this.image.height
    );
  }

  update() {
    this.draw();
    this.x += this.speed;
    if (this.x > width) {
      this.x = -this.image.width;
    }
  }
}

// class for logs
class Log {
  constructor(x, y, speed) {
    this.image = new Image(250, 70);
    this.image.src = log_src;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  draw() {
    context.drawImage(
      this.image,
      this.x,
      this.y,
      this.image.width,
      this.image.height
    );
  }
  update() {
    this.draw();
    this.x += this.speed;
    if (this.x > width) {
      this.x = -this.image.width;
    }
  }
}


// creating frog for game
let frog = new Frog();

// creating cars for game
let cars = [
  new Car(0, line_height * 5, 4),
  new Car(300, line_height * 5, 4),
  new Car(600, line_height * 5, 4),
  new Car(0, line_height * 6, 6),
  new Car(400, line_height * 6, 6),
  new Car(0, line_height * 7, 5),
  new Car(500, line_height * 7, 5),
];

// creating logs for game
let logs = [
  new Log(0, line_height, 4),
  new Log(450, line_height, 4),
  new Log(0, line_height * 2, 3),
  new Log(500, line_height * 2, 3),
  new Log(0, line_height * 3, 5),
  new Log(450, line_height * 3, 5),
];

// initial board for game
const initialBoard = () => {
  let img = new Image(800, 70);
  img.src = "https://th.bing.com/th/id/OIG.CqRnobIwURmfja3tgt7y?pid=ImgGn";
  context.drawImage(img, 0, 0);
  context.drawImage(img, 0, 280);
  context.drawImage(img, 0, 560);
  context.fillStyle = "#33a7ff";
  context.fillRect(0, 70, width, 210);
  context.fillStyle = "gray";
  context.fillRect(0, 350, width, 210);
};

const winGame = () => {
  frog.speed = 0;
  frog.x = width / 2;
  frog.y = height - 70;
  if (winSound.paused) {
    winSound.play();
  } else {
    winSound.currentTime = 0;
  }
  started = false;
  setTimeout(() => {
    alert("hurray !! you won the game :)");
  }, 200);
};

// for resetting game
const resetGame = () => {
  frog.x = width / 2;
  frog.y = height - 70;
  frog.speed = 0;
  if (collisionSound.paused) {
    collisionSound.play();
  } else {
    collisionSound.currentTime = 0;
  }
};

let collision = false;
// function for checking collision of logs
const checkLogCollision = (coll) => {
  collision = coll;
  logs.forEach((element) => {
    if (
      frog.x + frog.image.width > element.x &&
      frog.x < element.x + element.image.width &&
      frog.y + frog.image.height > element.y &&
      frog.y < element.y + element.image.height
    ) {
      collision = true;
      frog.speed = element.speed;
    }
  });
  if (!collision) {
    resetGame();
    return;
  }
};
// function for checking car collisions
const checkCarCollision = () => {
  cars.forEach((element) => {
    if (
      frog.x + frog.image.width > element.x &&
      frog.x < element.x + element.image.width &&
      frog.y + frog.image.height > element.y &&
      frog.y < element.y + element.image.height
    ) {
      resetGame();
      return;
    }
  });
};
// function for updating location of the cars and logs
const updateLoop = () => {
  if (started) {
    // clearing whole board before updating location of cars and logs
    context.clearRect(0, 0, width, height);

    // checking car collisions
    checkCarCollision();
    // checking log collisions
    if (frog.y < line_height * 4 && frog.y >= 70) {
      checkLogCollision(collision);
    }
    // drawing initial board
    initialBoard();


    // updating all cars
    cars.forEach((element) => {
      element.update();
    });
    // updating all logs
    logs.forEach((element) => {
      element.update();
    });
    // updating frog
    frog.update();
    if (frog.y < 70) {
      winGame();
    }
    if (frog.y == line_height * 4) {
      frog.speed = 0;
    }
  } else {
    initialBoard();
    context.font = "70px Arial";
    context.fillStyle = "white";

    context.fillText("Press any key to start", 60, line_height * 5 - 15);
  }
  requestAnimationFrame(updateLoop);
};

// function for moving frog
const moveFrog = (event) => {
  if (!started) {
    started = true;
    return;
  }
  // frog one step on x-axis will be of 50px and on y-axis 70px
  let x_move = 50,
    y_move = 70;
  switch (event.keyCode) {
    case 37: // Left arrow key
      if (frog.x >= x_move) {
        frog.x -= x_move;
      }
      if (moveSound.paused) {
        moveSound.play();
      } else {
        moveSound.currentTime = 0;
      }
      break;
    case 39: // Right arrow key
      if (frog.x < width - x_move) {
        frog.x += x_move;
      }
      if (moveSound.paused) {
        moveSound.play();
      } else {
        moveSound.currentTime = 0;
      }
      break;
    case 38: // Up arrow key
      if (frog.y >= y_move) {
        frog.y -= y_move;
      }
      if (moveSound.paused) {
        moveSound.play();
      } else {
        moveSound.currentTime = 0;
      }
      break;
    case 40: // Down arrow key
      if (frog.y < height - y_move) {
        frog.y += y_move;
      }
      if (moveSound.paused) {
        moveSound.play();
      } else {
        moveSound.currentTime = 0;
      }
      break;
  }

  // after changing location of frog , drawing frog
  frog.draw();
  if (frog.y < line_height * 4 && frog.y >= 70) {
    checkLogCollision(false);
  }
};

// on key down executing function moveFrog
window.addEventListener("keydown", moveFrog);

updateLoop();
