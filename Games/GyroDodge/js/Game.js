/**
 * @class Game
 * manages all the game states
 */
class Game {
  constructor(assets) {
    this.bgColor = color(41, 196, 123, 105);
    this.score = 0;
    this.gameover = false;
    this.gamewin = false;

    this.countDown = 1;
    this.ship = new Player();
    this.bullets = [];
    this.particles = [];
    this.rocks = [];
    this.sounds = assets.sounds;
    this.level = 1;
    this.rockBreakRadius = 25;

    this.domRestart = document.getElementById('game-restart');
    this.domGamestart = document.getElementById('game-start');
    this.domGamestartTimer = document.getElementById('game-start-timer');
    this.domGameover = document.getElementById('game-over');
    this.domScore = document.getElementById('score');
    this.domLevel = document.getElementById('level');
    this.domGameWin = document.getElementById('game-win');
    this.domGameNextLevel = document.getElementById('next-level');
    this.domGameWinLevel = document.getElementById('game-win-level');
    this.domLevel.textContent = 'Level: ' + (this.level)

    this.showStartScreen();
    this.domRestart.addEventListener('click', () => {
      this.restart();
    });

    this.domGameNextLevel.addEventListener('click', () => {
      this.restart();
      this.hideGameWin()
    });

    this.countDownTimer();
    let timer = window.setInterval(() => {
      this.countDownTimer();
    }, 1000);
    window.setTimeout(() => {
      this.hideStartScreen();
      window.clearInterval(timer);
    }, 2000);

    this.sounds.blast.amp(0.03);
    this.sounds.music.setLoop(true)
    this.sounds.music.amp(0.2);
    this.sounds.music.play();
  }

  restart() {
    console.log('restart');
    this.hideGameOver();
    this.init();
    this.countDown = -1;
    loop();
  }

  finish() {
    this.level = 1;
    this.domGameWinLevel.textContent = 'You Win! The Game. Congratulations'
    this.domLevel.textContent = 'Level: ' + (this.level);
    this.domGameNextLevel.textContent = 'Finish'
    this.restart();
  }
  win() {
    this.domGameNextLevel.textContent = 'Play Next Level'
    this.domLevel.textContent = 'Level: ' + (this.level + 1)
    this.domGameWinLevel.textContent = 'You Win! Level ' + (this.level) + ' Cleared!'
    this.showGameWin();
    this.gamewin = true;
    if (this.gamewin) {
      this.sounds.gamewin.amp(0.5);
      this.sounds.gamewin.play();
    }
    this.level++;
    if (this.level >= 5) {
      this.finish()
    }
  }

  countDownTimer() {
    this.domGamestartTimer.textContent = this.countDown;
    this.countDown--;
  }

  showGameWin() {
    this.domGameWin.classList.add('show');
  }
  hideGameWin() {
    this.domGameWin.classList.remove('show');
  }
  showStartScreen() {
    this.domGamestart.classList.remove('hide');
    this.domGamestart.classList.add('show');
  }
  hideStartScreen() {
    this.domGamestart.classList.remove('show');
    this.domGamestart.classList.add('hide');
  }

  showScore() {
    this.domScore.textContent = 'Score : ' + this.score;
  }

  over() {
    this.domGameover.classList.add('show');
    this.domScore.classList.add('animate');
    this.gameover && this.sounds.gameover.play();
  }

  hideGameOver() {
    this.domGameover.classList.add('hide');
    this.domGameover.classList.remove('show');
    this.domScore.classList.remove('animate');
  }

  handleLevels() {
    if (this.level === 1) {
      for (let i = 0; i < 3; i++) {
        this.rocks.push(new Rock(random(width), random(height), 20));
      }
    }
    if (this.level === 2) {
      this.rockBreakRadius = 25;
      for (let i = 0; i < 10; i++) {
        this.rocks.push(new Rock(random(width), random(height), random(15, 20)));
      }
      this.bgColor = color(41, 108, 196, 105);
    }
    if (this.level === 3) {
      this.rockBreakRadius = 30;
      this.rocks.push(new Rock(random(width), random(height), 50));
      this.bgColor = color(158, 87, 240, 105);
    }
    if (this.level === 4) {
      this.rockBreakRadius = 20;
      for (let i = 0; i < 10; i++) {
        this.rocks.push(new Rock());
      }
      this.bgColor = color(240, 87, 138, 105);
    }
    if (this.level === 5) {
      this.rockBreakRadius = 25;
      for (let i = 0; i < 10; i++) {
        this.rocks.push(new Rock(random(width), random(height), 26));
      }
      this.rocks.push(new Rock(random(width), random(height), 100));
      this.bgColor = color(231, 162, 58, 105);
    }
  }

  init() {
    this.score = 0;
    this.gameover = false;
    this.gamewin = false;
    this.countDown = 1;
    this.ship.reset();
    this.bullets = [];
    this.rocks = [];
    this.handleLevels();
  }
}