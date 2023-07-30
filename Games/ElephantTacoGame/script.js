const urlSrc = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963",
fullAudio = new Audio(`${urlSrc}/airship.mp4`),
audioIncrease = new Audio(`${urlSrc}/coin2.mp4`),
audioDecrease = new Audio(`${urlSrc}/attack_hit.mp4`),
audioMargarita = new Audio(`${urlSrc}/Pickup_04.mp3`);

const App = React.createClass({ displayName: "App",
  getInitialState: function () {
    return {
      isMuted: false,
      isPlaying: false,
      score: 500,
      startTime: 0,
      finalScore: 0 };

  },

  componentDidMount: function () {
    if (typeof fullAudio.loop == 'boolean') {
      fullAudio.loop = true;
    } else {
      fullAudio.addEventListener('ended', function () {
        this.currentTime = 0;
        setTimeout(() => {this.play();}, 3000);
      }, false);
    }
    fullAudio.play();
  },

  startGame: function (setGameToStart) {
    this.setState({ isPlaying: setGameToStart,
      score: 500,
      startTime: Date.now() });

  },

  _handleSoundChange: function () {
    this.setState({ isMuted: !this.state.isMuted });
    fullAudio.muted = audioIncrease.muted = audioDecrease.muted = audioMargarita.muted = !this.state.isMuted;
    fullAudio.currentTime = this.state.isMuted ? fullAudio.currentTime : 0;
  },

  _updateScore: function (scoreDelta) {
    let score = Math.min(Math.max(0, this.state.score + scoreDelta), 1270);
    this.setState({ score: score });
    if (score === 0 || score === 1270) {
      this.setState({ isPlaying: false,
        finalScore: 10000 - Math.round((Date.now() - this.state.startTime) / 30) });
    }
  },

  _isGameOver: function () {
    return this._isGameLost() || this._isGameWon();
  },

  _isGameLost: function () {
    return this.state.score === 0;
  },

  _isGameWon: function () {
    return this.state.score === 1270;
  },

  render() {
    const source = this.state.isMuted ? 'sounds.svg' : 'mute.svg',
    url = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/${source}`;
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { className: "mutebutton", onClick: this._handleSoundChange }, /*#__PURE__*/
      React.createElement("img", { src: url })), /*#__PURE__*/

      React.createElement(Controls, { _updateScore: this._updateScore, isPlaying: this.state.isPlaying, _isGameOver: this._isGameOver }), /*#__PURE__*/
      React.createElement(HeartMeter, { score: this.state.score }), /*#__PURE__*/
      React.createElement(Opener, { startGame: this.startGame }), /*#__PURE__*/
      React.createElement(Won, { _isGameWon: this._isGameWon, startGame: this.startGame, finalScore: this.state.finalScore }), /*#__PURE__*/
      React.createElement(Lost, { _isGameLost: this._isGameLost, startGame: this.startGame })));


  } });


const Controls = React.createClass({ displayName: "Controls",
  getInitialState: function () {
    return {
      countY: 0,
      countX: 0,
      tacoPassed: false,
      margaritaPassed: false,
      textPassed: false };

  },

  _flyBy: function (el, amt, name, delay) {
    if (this.props._isGameOver()) return;

    let obj = {},
    offset = document.getElementById('container').offsetHeight,
    randY = Math.random() * (offset - 1) + 1;
    //randY = amt * 50; this is for testing
    obj[name] = false;
    this.setState(obj);

    TweenMax.fromTo(el, amt, {
      rotation: 0,
      y: randY,
      x: window.innerWidth + 200 },
    {
      x: -200,
      y: randY,
      rotation: 360,
      delay: delay,
      onComplete: this._flyBy,
      onCompleteParams: [el, amt, name, delay],
      ease: Power1.easeInOut });

  },

  _elephantDirection: function (e) {
    let currentCountX = this.state.countX,
    currentCountY = this.state.countY,
    amt = 20;

    if (e == "left" || e.keyCode == "37") {
      currentCountX -= amt;
    } else if (e == "right" || e.keyCode == "39") {
      currentCountX += amt;
    } else if (e == "up" || e.keyCode == "38") {
      currentCountY -= amt;
    } else if (e == "down" || e.keyCode == "40") {
      currentCountY += amt;
    }

    this.setState({
      countX: currentCountX,
      countY: currentCountY });


    let elContainer = this.refs.elContainer;
    TweenMax.to(elContainer, 0.2, {
      x: currentCountX,
      y: currentCountY,
      ease: Power4.easeOut });

  },

  componentDidMount: function () {
    window.addEventListener("keydown", this._elephantDirection, false);

    let tC1 = this.refs.tContainer,
    txC1 = this.refs.txContainer,
    mC1 = this.refs.mContainer,
    ele1 = this.refs.elContainer,
    getHitTestIncrease = this._hitTestIncrease,
    getHitTestDecrease = this._hitTestDecrease,
    getHitTestMargarita = this._hitTestMargarita;

    (function getCoords() {
      let tCoords = tC1.getBoundingClientRect(),
      txCoords = txC1.getBoundingClientRect(),
      mCoords = mC1.getBoundingClientRect(),
      elCoords = ele1.getBoundingClientRect();

      function intersectRect(a, b) {
        return Math.max(a.left, b.left + 40) < Math.min(a.right, b.right - 40) &&
        Math.max(a.top, b.top + 40) < Math.min(a.bottom, b.bottom - 40);
      }

      // can't do if/else because sometimes they both come out at once and one of them will be ignored
      if (intersectRect(tCoords, elCoords)) {
        getHitTestIncrease();
      }
      if (intersectRect(txCoords, elCoords)) {
        getHitTestDecrease();
      }
      if (intersectRect(mCoords, elCoords)) {
        getHitTestMargarita();
      }

      requestAnimationFrame(getCoords);
    })();
  },

  componentDidUpdate: function (prevProps) {
    if (this.props.isPlaying && !prevProps.isPlaying) {
      let tC1 = this.refs.tContainer,
      txC1 = this.refs.txContainer,
      mC1 = this.refs.mContainer;

      this._flyBy(tC1, 5, "tacoPassed", 0.1);
      this._flyBy(txC1, 4, "textPassed", 0.2);
      this._flyBy(mC1, 4, "margaritaPassed", 13);
    }
  },

  _hitTestIncrease: function () {
    if (!this.state.tacoPassed && this.props.isPlaying) {

      //animation for wowie
      let inWow = this.refs.inWow,
      tl = new TimelineLite();

      audioIncrease.play();
      tl.fromTo(inWow, 0.4, {
        autoAlpha: 0,
        scale: 0.5 },
      {
        autoAlpha: 1,
        scale: 1,
        ease: Power4.easeOut });

      tl.to(inWow, 0.2, {
        autoAlpha: 0,
        scale: 0.5,
        ease: Power2.easeIn },
      "+=0.3");

      this.setState({ tacoPassed: true });
      this.props._updateScore(75);
    }
  },

  _hitTestDecrease: function () {
    if (!this.state.textPassed && this.props.isPlaying) {

      //animation for uhoh
      let deWow = this.refs.deWow,
      tl = new TimelineLite();;

      audioDecrease.play();
      tl.fromTo(deWow, 0.4, {
        autoAlpha: 0,
        scale: 0.5 },
      {
        autoAlpha: 1,
        scale: 1,
        ease: Bounce.easeOut });

      tl.to(deWow, 0.3, {
        autoAlpha: 0,
        scale: 0.5,
        ease: Power3.easeIn },
      "+=0.3");

      this.setState({ textPassed: true });
      this.props._updateScore(-200);
    }
  },

  _hitTestMargarita: function () {
    if (!this.state.margaritaPassed && this.props.isPlaying) {

      //animation for margarita
      let mWow = this.refs.mWow,
      overlayM = this.refs.overlayM,
      tl = new TimelineLite();

      audioMargarita.play();
      tl.add("start");
      tl.fromTo(mWow, 0.4, {
        autoAlpha: 0,
        scale: 0.5 },
      {
        autoAlpha: 1,
        scale: 1,
        ease: Bounce.easeOut },
      "start");
      tl.to(overlayM, 0.4, {
        ease: RoughEase.ease.config({
          template: Power2.easeOut,
          strength: 1.5,
          points: 20,
          taper: "none",
          randomize: true,
          clamp: false }),

        autoAlpha: 0.6 },
      "start");
      tl.to(mWow, 0.3, {
        autoAlpha: 0,
        scale: 0.5,
        ease: Power3.easeIn },
      "start+=0.5");
      tl.to(overlayM, 0.3, {
        autoAlpha: 0,
        ease: Power3.easeIn },
      "start+=0.4");

      this.setState({ margaritaPassed: true });
      this.props._updateScore(+200);
    }
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("svg", { className: "controls controls-top", id: "touch-controls", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 210.8 101.5", "aria-labelledby": "title" }, /*#__PURE__*/
      React.createElement("title", { id: "controls" }, "controls"), /*#__PURE__*/
      React.createElement("rect", { x: "120.2", y: "44.7", width: "59.3", height: "49.21", rx: "15", ry: "15", transform: "rotate(-180 146.45 66.7)", fill: "#006666" }), /*#__PURE__*/
      React.createElement("g", { id: "up", onClick: this._elephantDirection.bind(this, "up") }, /*#__PURE__*/React.createElement("path", { fill: "#fff", d: "M150.9 49.5l-7.1-4.6-7.1 4.6h2.9V57h6.2v-7.5h5.1z" }), /*#__PURE__*/React.createElement("path", { d: "M138.7 50.4h-4.4L144 44l8.4 5.5-1.4.9h-3.1v6.5l-1.4.9h-7.8zm-1.3-.9h2.6v7.4h5.2v-7.4h2.6l-5.2-3.4z", fill: "#000" })), /*#__PURE__*/
      React.createElement("g", { id: "right", onClick: this._elephantDirection.bind(this, "right") }, /*#__PURE__*/React.createElement("path", { fill: "#fff", d: "M160.8 71.6l4.6-7.5-4.6-7.6v3.1h-7.5v6.6h7.5v5.4z" }), /*#__PURE__*/React.createElement("path", { d: "M159.9 58.6v-4.7l6.4 10.4-5.5 8.9-.9-1.5v-3.2h-6.5l-.9-1.5v-8.4zm.9-1.4V60h-7.4v5.6h7.4v2.8l3.4-5.6z", fill: "#000" })), /*#__PURE__*/
      React.createElement("g", { id: "down", onClick: this._elephantDirection.bind(this, "down") }, /*#__PURE__*/React.createElement("path", { fill: "#fff", d: "M150.9 78l-7.1 4.6-7-4.6h2.9v-7.5h6.2V78h5z" }), /*#__PURE__*/React.createElement("path", { d: "M138.8 69.7h7.7l1.4.9v6.5h3l1.4.9-8.3 5.5-9.7-6.4h4.4zm3.9 11.7l5.2-3.4h-2.6v-7.4h-5.2V78h-2.6z", fill: "#000" })), /*#__PURE__*/
      React.createElement("g", { id: "left", onClick: this._elephantDirection.bind(this, "left") }, /*#__PURE__*/React.createElement("path", { fill: "#fff", d: "M126.2 71.6l-4.7-7.5 4.7-7.6v3.1h7.4v6.6h-7.4v5.4z" }), /*#__PURE__*/React.createElement("path", { d: "M134.4 58.6v8.3l-.9 1.5H127v3.3l-.9 1.5-5.5-8.9 6.4-10.4v4.8zm-11.7 4.2l3.4 5.6v-2.8h7.4V60h-7.4v-2.8z", fill: "#000" }))), /*#__PURE__*/

      React.createElement("div", { className: "elephantContainer", ref: "elContainer" }, /*#__PURE__*/
      React.createElement(Elephant, null), /*#__PURE__*/
      React.createElement("div", { className: "deWow wow", ref: "deWow" }), /*#__PURE__*/
      React.createElement("div", { className: "inWow wow", ref: "inWow" }), /*#__PURE__*/
      React.createElement("div", { className: "mWow wow", ref: "mWow" })), /*#__PURE__*/

      React.createElement("div", { className: "tacoContainer", ref: "tContainer" }, /*#__PURE__*/
      React.createElement("div", { className: "taco", ref: "taco" })), /*#__PURE__*/

      React.createElement("div", { className: "margaritaContainer", ref: "mContainer" }, /*#__PURE__*/
      React.createElement("div", { className: "margarita", ref: "margarita" })), /*#__PURE__*/

      React.createElement("div", { className: "textContainer", ref: "txContainer" }, /*#__PURE__*/
      React.createElement(Text, { ref: "textmessages" })), /*#__PURE__*/

      React.createElement("div", { className: "overlay overlayMargarita", ref: "overlayM" })));


  } });


const HeartMeter = React.createClass({ displayName: "HeartMeter",
  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("svg", { className: "heartmeter", xmlns: "http://www.w3.org/2000/svg", width: "250", height: "50", viewBox: "0 0 1741.8 395.6" }, /*#__PURE__*/
      React.createElement("path", { d: "M1741.8 197.7c0 109.3-89 197.8-198.8 197.8a198.6 198.6 0 0 1-158.5-78.4H11.2A11.2 11.2 0 0 1 0 305.9V89.5a11.2 11.2 0 0 1 11.2-11.1h1373.4A198.8 198.8 0 0 1 1543 0c109.8 0 198.8 88.5 198.8 197.7z", fill: "#000" }), /*#__PURE__*/
      React.createElement("path", { d: "M1591.8 127c-18.3 0-34.1 14.8-41.4 30.3-7.3-15.5-23.1-30.3-41.4-30.3a45.7 45.7 0 0 0-45.7 45.5c0 51.1 51.8 64.5 87.1 115.1 33.4-50.2 87.1-65.6 87.1-115.1a45.7 45.7 0 0 0-45.7-45.5z", fill: "#b29968" }), /*#__PURE__*/
      React.createElement("rect", { x: "68.2", y: "140.8", width: this.props.score, height: "101.55", fill: "#9391aa" }))));



  } });


const Won = React.createClass({ displayName: "Won",
  componentWillUpdate: function () {
    if (this.props._isGameWon() === true) {
      this._youWon();
    }
  },

  _youWon: function () {
    const winContainer = this.refs.winContainer;
    TweenMax.fromTo(winContainer, 0.2, {
      autoAlpha: 0 },
    {
      autoAlpha: 1,
      ease: Power3.easeOut });

    let b = baffle('.winning-text');
    b.set({
      characters: '+-•~░█▓ ▓▒░!=*' });

    b.start();
    b.reveal(2000);
  },

  _handleRestartClick: function () {
    const winContainer = this.refs.winContainer;
    TweenMax.fromTo(winContainer, 0.2, {
      autoAlpha: 1 },
    {
      autoAlpha: 0,
      ease: Power3.easeOut });

    this.props.startGame(true);
  },

  render() {
    const final = this.props.finalScore,
    twitterURL = "https://twitter.com/intent/tweet?text=I+won+at+Elephant+Taco+Hunt+on+@CodePen!+My+score+was+" + final + "!+You+can+play+here:+https://codepen.io/sdras/full/YWBdQd&via=sarah_edo";
    return /*#__PURE__*/(
      React.createElement("div", { className: "winContainer", ref: "winContainer" }, /*#__PURE__*/
      React.createElement("div", { className: "overlay overlayWinning" }), /*#__PURE__*/
      React.createElement("div", { className: "winning" }, /*#__PURE__*/
      React.createElement("h1", { className: "winning-text" }, "Congrats!"), /*#__PURE__*/


      React.createElement("div", { className: "winning-text" }, "You got to eat tacos and nobody changed your plans! Super."), /*#__PURE__*/

      React.createElement("div", { className: "twitter" }, /*#__PURE__*/
      React.createElement("a", { href: twitterURL, target: "_blank" }, "Tweet your score! ", /*#__PURE__*/React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "25", height: "25", viewBox: "0 0 32 32" }, /*#__PURE__*/React.createElement("path", { fill: "#00ffff", d: "M32 7.075c-1.175.525-2.444.875-3.77 1.03 1.357-.812 2.395-2.1 2.888-3.63-1.27.75-2.675 1.3-4.17 1.594C25.75 4.793 24.044 4 22.156 4c-3.625 0-6.563 2.938-6.563 6.563 0 .512.056 1.012.17 1.494C10.304 11.782 5.466 9.17 2.23 5.195c-.563.97-.887 2.1-.887 3.3 0 2.275 1.156 4.287 2.92 5.463-1.076-.03-2.088-.33-2.976-.82v.082c0 3.18 2.263 5.838 5.27 6.437-.55.15-1.132.23-1.732.23-.425 0-.83-.043-1.237-.118.838 2.605 3.263 4.505 6.13 4.562-2.25 1.762-5.074 2.813-8.155 2.813-.53 0-1.05-.03-1.57-.094C2.908 28.92 6.357 30 10.064 30c12.075 0 18.68-10.005 18.68-18.68 0-.287-.005-.57-.018-.85 1.28-.92 2.394-2.075 3.275-3.394z" })))), /*#__PURE__*/

      React.createElement("div", { className: "award" }), /*#__PURE__*/
      React.createElement("button", { className: "start", onClick: this._handleRestartClick }, "Play again!"))));



  } });


const Lost = React.createClass({ displayName: "Lost",
  componentWillUpdate: function () {
    if (this.props._isGameLost() === true) {
      this._youLose();
    }
  },

  _youLose: function () {
    const loseContainer = this.refs.loseContainer;
    TweenMax.fromTo(loseContainer, 0.2, {
      autoAlpha: 0 },
    {
      autoAlpha: 1,
      ease: Power3.easeOut });

    let b = baffle('.hangry-text');
    b.set({
      characters: '+-•~░█▓ ▓▒░!=*' });

    b.start();
    b.reveal(2000);
  },

  _handleRestartClick: function () {
    const loseContainer = this.refs.loseContainer;
    TweenMax.fromTo(loseContainer, 0.2, {
      autoAlpha: 1 },
    {
      autoAlpha: 0,
      ease: Power3.easeOut });

    this.props.startGame(true);
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "loseContainer", ref: "loseContainer" }, /*#__PURE__*/
      React.createElement("div", { className: "overlay overlayLosing" }), /*#__PURE__*/
      React.createElement("div", { className: "hangry" }, /*#__PURE__*/
      React.createElement("h1", { className: "hangry-text" }, "Aw Nuts!"), /*#__PURE__*/


      React.createElement("div", { className: "hangry-text" }, "You were overruled and didn't get to eat any tacos. Sounds like you're going to a movie you already saw instead."), /*#__PURE__*/


      React.createElement("div", { className: "hangry-svg" }), /*#__PURE__*/
      React.createElement("button", { className: "start", onClick: this._handleRestartClick }, "Play again!"))));



  } });


const Text = React.createClass({ displayName: "Text",
  componentDidMount: function () {
    let bkT = this.refs.bkText;

    TweenMax.to(bkT, 0.5, {
      ease: RoughEase.ease.config({
        template: Power0.easeNone,
        strength: 1,
        points: 10,
        taper: "none",
        randomize: true,
        clamp: false }),

      repeat: -1,
      yoyo: true,
      fill: "#eee" });

  },

  render() {
    return /*#__PURE__*/(
      React.createElement("svg", { className: "text", width: "65.9", height: "80.6", viewBox: "0 0 65.9 80.6", role: "presentation" }, /*#__PURE__*/
      React.createElement("path", { ref: "bkText", fill: "#d16f43", d: "M.4 7.4H46v62.47H.4z" }), /*#__PURE__*/
      React.createElement("path", { fill: "#fcfbfa", d: "M27.5 29.8h33v13.75h-33z" }), /*#__PURE__*/
      React.createElement("path", { fill: "#e2dfd8", d: "M17.2 69.8h13.4v10.79H17.2z" }), /*#__PURE__*/
      React.createElement("path", { d: "M54.8 21.2H34.6a11.2 11.2 0 0 0-11.1 11.1v8.2a11 11 0 0 0 1.5 5.7 9.3 9.3 0 0 1-4 4.6.8.8 0 0 0 .2 1.4 10.8 10.8 0 0 0 8.2-1.9 11 11 0 0 0 5.2 1.3h20.2a11.2 11.2 0 0 0 11.1-11.1v-8.2a11.2 11.2 0 0 0-11.1-11.1zM34 39.8a3.4 3.4 0 0 1-3.4-3V36a3.4 3.4 0 1 1 3.4 3.8zm10.6.2a3.4 3.4 0 1 1 3.4-3.4 3.4 3.4 0 0 1-3.4 3.4zm10.6.2h-.7l-.6-.2a3.4 3.4 0 0 1 0-6.3l.6-.2h.7a3.4 3.4 0 0 1 0 6.9zM42.3 50.8v15.8a2.2 2.2 0 0 1-2.2 2.2H6.8a2.2 2.2 0 0 1-2.2-2.2V14a2.2 2.2 0 0 1 2.2-2.2h33.3a2.2 2.2 0 0 1 2.2 2.2v8h4.6V8.7A8.7 8.7 0 0 0 38.3 0H8.7A8.7 8.7 0 0 0 0 8.7v63.2a8.7 8.7 0 0 0 8.7 8.7h29.6a8.7 8.7 0 0 0 8.7-8.7V50.8zm-18.9 28a4 4 0 1 1 4-4 4 4 0 0 1-3.9 4z" })));


  } });


const Elephant = React.createClass({ displayName: "Elephant",
  render() {
    return /*#__PURE__*/(
      React.createElement("svg", { className: "elephant", xmlns: "http://www.w3.org/2000/svg", viewBox: "15 15 255 130" }, /*#__PURE__*/
      React.createElement("path", { id: "ear-right", className: "st0", d: "M173.9 62s58.7-16.7 68.3-32.3c9.7-15.7 19.7-11 18-2.7-1.7 8.3-40 49.3-49.7 47.7-9.7-1.7-27.7 7.1-31 0-3.2-7-15.7-9-5.6-12.7z" }), /*#__PURE__*/
      React.createElement("path", { className: "st1", d: "M154.1 117.3s16.5 6.9 18.5 11.2c2 4.2 1.5 6 3.5 5.8s11.2-5.8 8-12.9-23-24.9-28.8-17.4-6.2 12.4-1.2 13.3z" }), /*#__PURE__*/
      React.createElement("ellipse", { className: "st0", cx: "130.8", cy: "88.7", rx: "35.2", ry: "28.7" }), /*#__PURE__*/
      React.createElement("ellipse", { className: "st2", cx: "87.4", cy: "92.8", rx: "10.8", ry: "4.2" }), /*#__PURE__*/
      React.createElement("path", { className: "st1", d: "M208.3 104.6c0 .3-.1.5-.4.6l-16.1 2.8c-.3 0-.5-.1-.6-.4l-2.3-12.3c0-.3.1-.5.5-.6l16-3.8h.1c.1 0 .2.1.3.1.1 0 .2.1.2.3l2.3 13.3z" }), /*#__PURE__*/
      React.createElement("path", { className: "st1", d: "M245.4 85.4c-.3-1.3-.8-2.5-1.7-3.6-2.7-3.3-7.4-3.9-10.3-1.5-3 2.5-3.2 7.1-.5 10.4 2.2 2.6 5.6 3.6 8.4 2.6v.3c1 13-14.1 6.7-14.1 6.7-.2-.6-.4-1.2-.6-1.7l-2.2.7c-.5-.6-1.1-1.1-1.9-1.5l3.1-1c-.9-1.2-2.2-2.2-4.1-3.2.1-.8.1-2.7.1-3.5v-.8l-5.3.4c-.2 0-.5.2-.6.4-.2.2-.2.5-.2.8l1.1 6.4c-.7.2-1.3.5-1.9.9l-.7-3.8-4.3 1.2 1.5 8.4c.3 1.9-.9 3.7-2.8 4l-16.1 2.8h-.6c-1.7 0-3.2-1.2-3.5-2.9l-2.3-12.3c-.3-1.9.9-3.7 2.8-4.1l16-3.8c1-.2 1.9 0 2.7.6.8.5 1.3 1.3 1.4 2.3l.5 3 4.3-1.2-.2-1.2c-.1-.8 0-1.6.5-2.2.5-.7 1.2-1.1 1.9-1.2h.1l5.4-.4c-.5-5.2-2.5-10-5.6-14.2-2.9-3.9-6.8-7.2-11.3-9.8-5.5-3-11.9-4.9-18.8-5.1H184c-10.8 0-20.5 3.8-27.3 10-.2.2-.4.3-.5.5-5.2 4.9-8.6 11.1-9.4 17.9-.1 1.1-.2 2.2-.2 3.3-1.3 2.2-1.7 4.7-1.5 7.5.2 2.1.8 4.4 1.8 6.6 1 2.3 2.5 4.5 4.4 6.6.2.3.5.5.7.8.7.8 1.6 1.5 2.4 2.3l.3.3c4 3.3 8.5 5.2 12.7 5.9 4.6 2.4 10.6 4.2 17.4 4.9.7.1 1.4.1 2.2.2 10 .7 19-1.2 24.7-4.6 1.9-.5 3.8-1.3 5.5-2.1 1.2-.6 2.4-1.3 3.4-2 8.2 3.5 17.8 3.1 17.8 3.1 21.3-.2 13-24.1 7-34.1z" }), /*#__PURE__*/
      React.createElement("path", { className: "st2", d: "M120.9 116.5s-20.3-44.5-7.5-52.8c0 0-65.1 26.3 7.5 52.8z" }), /*#__PURE__*/
      React.createElement("ellipse", { className: "st2", cx: "87.8", cy: "99.8", rx: "19.2", ry: "7.8" }), /*#__PURE__*/
      React.createElement("path", { className: "st2", d: "M204.8 63.6s-20.1-29.6-44-11.9c0 0-3.9-3.3-7.3 3.3-4 7.9-5.1 7.3-5.1 7.3s-6-4.2-6.9 10.5c-.8 14.7-15.7 22.5-4.8 26.2 10.8 3.7 31.8-23.7 31.8-23.7s19.7-16.8 36.3-11.7z" }), /*#__PURE__*/
      React.createElement("path", { id: "ear-left", className: "st0", d: "M160.3 68.7S111.6 63 64 78.4c0 0-31.3 5.7-35 0 0 0-18.7-5.3-5.7 5.2 0 0 20.3 15.8 55.3 16s60.7-11.2 60.7-11.2l23.7-4.8c-.1-.1 23.3-13.9-2.7-14.9z" }), /*#__PURE__*/
      React.createElement("g", { id: "eyes" }, /*#__PURE__*/
      React.createElement("ellipse", { className: "st3", cx: "200.7", cy: "99.5", rx: "2.2", ry: "4.5" }), /*#__PURE__*/
      React.createElement("ellipse", { className: "st3", cx: "219.1", cy: "94.4", rx: ".8", ry: "2.6" })), /*#__PURE__*/

      React.createElement("path", { className: "st4", d: "M217.1 118.3s-14.5 2-16.3-4M205.3 110.7s2 6-10.7 3.8" }), /*#__PURE__*/
      React.createElement("path", { className: "st1", d: "M162.3 129s-4.2-.8-6-8c-1.8-7.2-2-18-13-17s-12.5 8.8-12.5 8.8-4 6.7 7.5 17.2c0 0 2.7 1.8 3.6 6.5 1.5 8.1 20.4-7.5 20.4-7.5z" }), /*#__PURE__*/
      React.createElement("ellipse", { transform: "rotate(-20.12 152.072 132.685)", className: "st1", cx: "152.1", cy: "132.7", rx: "10.9", ry: "6.7" }), /*#__PURE__*/
      React.createElement("path", { d: "M141.6 112.8c-.3.1-.6 0-.7-.3-.1-.3 0-.6.3-.7.3-.1.6 0 .7.3.1.3-.1.6-.3.7zm5.7 2.4l-1-1.5c-.1-.1-.3-.2-.4-.1-.1 0-.2.1-.2.2l-.7 1.6v.1c0 .2.1.4.3.4h.4c.1.9-.3 1.8-1.1 2.4l-2.4-5.2c.3-.4.4-.9.2-1.4-.3-.6-1-.9-1.7-.6-.6.3-.9 1-.6 1.7.2.5.7.7 1.2.7l2.4 5.2c-.9.2-1.9 0-2.6-.7l.2-.2.1-.1c.1-.2 0-.4-.1-.5h-.1l-1.7-.6h-.3c-.2.1-.2.2-.2.4l.5 1.7v.1c.1.2.3.3.5.2 0 0 .1 0 .1-.1l.2-.2c1 1.1 2.7 1.5 4.2.8s2.3-2.2 2.1-3.7h.4c.4-.1.5-.3.3-.6.1 0 .1 0 0 0z" }), /*#__PURE__*/
      React.createElement("g", { id: "glasses" }, /*#__PURE__*/
      React.createElement("path", { className: "st2", d: "M229.1 95.2l-.3-5.5v-.1c-.1-.8-.6-1.5-1.2-1.9-.6-.5-1.4-.6-2.2-.5l-3.9.3-5.4.4h-.1c-.8.1-1.5.6-1.9 1.2-.5.7-.6 1.5-.5 2.2l.2 1.2-4.3 1.2-.5-3c-.2-.9-.7-1.7-1.4-2.3-.8-.5-1.7-.8-2.7-.6l-16 3.8c-1.9.3-3.2 2.1-2.8 4.1l2.3 12.3c.3 1.7 1.8 2.9 3.5 2.9h.6l16.1-2.8c1.9-.3 3.2-2.1 2.8-4l-1.5-8.4 4.3-1.2.7 3.8c.6-.4 1.2-.7 1.9-.9l-1.1-6.4c0-.3 0-.5.2-.8.1-.2.4-.3.6-.4l5.3-.4 4-.3h.1c.3 0 .5 0 .8.2.2.2.3.4.4.6l.3 5.5v.1c0 .3 0 .5-.2.7-.2.2-.4.4-.7.4l-.7.2-3.1 1c.8.4 1.4.9 1.9 1.5l2.2-.7h.1c.8-.1 1.4-.6 1.9-1.2.2-.6.4-1.4.3-2.2zm-21.3 10l-16.1 2.8c-.3 0-.5-.1-.6-.4l-2.3-12.3c0-.3.1-.5.5-.6l16-3.8h.1c.1 0 .2.1.3.1.1 0 .2.1.2.3l2.3 13.4c.1.1-.1.4-.4.5z" }))));



  } });


const Opener = React.createClass({ displayName: "Opener",
  componentDidMount: function () {
    let o = baffle('.opener-text');
    o.set({
      characters: '+-•~░█▓ ▓▒░!=*' });

    o.start();
    o.reveal(2000);
  },

  _handleOpenClick: function () {
    TweenMax.to(".openContainer", 1, {
      autoAlpha: 0 });

    this.props.startGame(true);
  },

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "openContainer" }, /*#__PURE__*/
      React.createElement("div", { className: "overlay overlayOpener" }), /*#__PURE__*/
      React.createElement("div", { className: "opener" }, /*#__PURE__*/
      React.createElement("div", { id: "opener-text" }, "Once there was an elephant. He was excited to go out with his friends and get tacos, but they kept texting him to change the plans. Help the elephant get all the tacos and avoid flakey text messages to get to delicious glory!"), /*#__PURE__*/


      React.createElement("button", { className: "start", onClick: this._handleOpenClick }, "Let's go!"))));



  } });


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));

//animation that's repeated for all of the sections
function revolve() {
  var tl = new TimelineMax(),
  cm1 = dc("cloudmove1"),
  cm2 = dc("cloudmove2"),
  cm3 = dc("cloudmove3"),
  ear1 = dc("ear-right"),
  ear2 = dc("ear-left");

  function dc(el) {
    return document.getElementById(el);
  }

  tl.add("begin");
  tl.to(cm1, 4, {
    x: 4,
    y: 10,
    repeat: -1,
    yoyo: true,
    ease: Linear.easeNone },
  "begin");
  tl.to(cm2, 4, {
    x: 20,
    y: 3,
    repeat: -1,
    yoyo: true,
    ease: Linear.easeNone },
  "begin");
  tl.to(cm3, 4, {
    x: -10,
    y: 3,
    repeat: -1,
    yoyo: true,
    ease: Linear.easeNone },
  "begin");
  //ears
  tl.to(ear1, 1, {
    y: 3,
    transformOrigin: "0% 100%",
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Sine.easeInOut },
  "begin");
  tl.to(ear2, 1, {
    transformOrigin: "100% 30%",
    rotation: -10,
    repeat: -1,
    yoyo: true,
    ease: Sine.easeInOut },
  "begin");
  tl.to(".elephant", 2, {
    y: 10,
    yoyo: true,
    repeat: -1,
    ease: Sine.easeInOut },
  "begin");
  tl.fromTo(".cloud", 20, {
    x: 2000 },
  {
    x: -500,
    repeat: -1,
    ease: Linear.easeNone },
  "begin");
  tl.fromTo(".cloud2", 25, {
    x: 1200 },
  {
    x: -500,
    repeat: -1,
    ease: Linear.easeNone },
  "begin");
  tl.fromTo(".cloud3", 22, {
    x: 1200 },
  {
    x: -500,
    repeat: -1,
    repeatDelay: 10,
    ease: Linear.easeNone },
  "begin");

  return tl;
}

var repeat = new TimelineMax();
repeat.add(revolve());

var controlsMQ = document.getElementById("touch-controls"),
openerMQ = document.getElementById("opener-text"),
rotateMQ = document.getElementById("rotate-mobile"),
dialogMQ = document.querySelectorAll("div.opener, div.winning, div.hangry"),
elephantMQ = document.querySelectorAll("div.elephantContainer")[0],
endsvgMQ = document.querySelectorAll("div.award, div.hangry-svg");

// media query event handler
if (matchMedia) {
  var mq = window.matchMedia("(min-width: 800px)");
  mq.addListener(WidthChange);
  WidthChange(mq);
}

// media query change
function WidthChange(mq) {
  if (mq.matches) {
    // window width is at least 800px
    controlsMQ.style.width = "30vw";
    controlsMQ.style.top = "40vh";
    controlsMQ.style.right = "-3vw";
    openerMQ.style.minHeight = "155px";
    elephantMQ.style.width = "30vw";
    for (var i = 0; i < dialogMQ.length; i++) {
      dialogMQ[i].style.fontSize = "1.1em";
      dialogMQ[i].style.lineHeight = "2em";
    }
    for (var i = 0; i < endsvgMQ.length; i++) {
      endsvgMQ[i].style.display = "block";
    }
  } else {
    // window width is less than 800px
    controlsMQ.style.width = "80vw";
    controlsMQ.style.top = "30vh";
    controlsMQ.style.right = "-15vw";
    openerMQ.style.minHeight = "0";
    elephantMQ.style.width = "45vw";
    for (var i = 0; i < dialogMQ.length; i++) {
      dialogMQ[i].style.fontSize = "0.8em";
      dialogMQ[i].style.lineHeight = "1.4em";
    }
    for (var i = 0; i < endsvgMQ.length; i++) {
      endsvgMQ[i].style.display = "none";
    }
  }

}