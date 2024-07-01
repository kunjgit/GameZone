class GameView {
  constructor(props) {
    this.ctx = props.ctx;
    this.game = props.game;
    this.avatar = this.game.addAvatar();
    this.fps = 60;
    this.framesThisSecond = 0,
    this.lastFPSCalc = 0;
    this.timeDelta = 0;
    this.timeStep = 1000/60;
  }

  start() {
    this.lastTimestamp = 0;
    requestAnimationFrame(this.animate.bind(this));
    this.game.music.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    this.game.music.play();
  }

  animate(timestamp) {
    // UPDATE FPS

    // CONVERT TIMEDELTA FROM MS TO S

    this.timeDelta += timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    while (this.timeDelta >= this.timeStep) {
      this.game.tick(this.timeStep/1000, this.fps);
      this.timeDelta -= this.timeStep;
    }
    this.game.draw(this.ctx);
    this.game.requestId = requestAnimationFrame(this.animate.bind(this));

    if (timestamp > this.lastFPSCalc + 1000) {
      this.fps = .33 * this.framesThisSecond + (1 - .33) * this.fps;

      this.lastFPSCalc = timestamp;
      this.framesThisSecond = 0;
    }
    this.framesThisSecond++;
  }
}

module.exports = GameView;
