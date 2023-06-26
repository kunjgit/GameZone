var game = (function () {
  "use strict";
  var bgcanvas, treecanvas, bcanvas, pcanvas, chipscanvas, canvas, scorecanvas, bctx, treectx, pctx, chipsctx, scorectx, cX, cY, H, W, ctx, bgctx, AttackDetail, wavysky, i, ground, floorChips, forestbg, forestbg2, forestbg3, forestbg4, forestbg5, tree, terry, scoreBoard, ctxTweener, bird, bear, isPlaying,
    scoreInterval = 0,
    keysDown = {},
    bgLoaded = false,
    viewX = 0,
    viewY = 0,
    isPaused = false,
    date = new Date(), lastTime = date.getTime(), curTime = lastTime;

  function init() {
    canvas = $("terry");
    bgcanvas = $("bg");
    scorecanvas = $("score");
    chipscanvas = $("chips");
    treecanvas = $("tree");
    pcanvas = $("particles");
    bcanvas = $("bear");
    ctx = canvas.getContext("2d");
    bgctx = bgcanvas.getContext("2d");
    treectx = treecanvas.getContext("2d");
    scorectx = scorecanvas.getContext("2d");
    pctx = pcanvas.getContext("2d");
    bctx = bcanvas.getContext("2d");
    chipsctx = chipscanvas.getContext("2d");
    W = canvas.width;
    H = canvas.height;
    cX = W * 0.5;
    cY = H * 0.5;



    wavysky = new WavySky({
      ctx: bgctx
    });
    ground = new GrassGround({
      ctx: bgctx,
      y: 330,
      height: 70
    });
    floorChips = new FloorChips({
      ctx: chipsctx
    });
    bear = new Bear({ ctx:bctx });
    tree = new ClimbableTree({
      ctx: treectx,
      x: 470,
      y: 360,
      floorChips: floorChips,
      bear: bear
    });
    terry = new Terry({
      x: 300,
      y: 300,
      groundY: 300,
      tree: tree
    });
    bird = new Bird({ x:200, y:200, follow:terry });
    forestbg = new Forest({
      ctx: bgctx,
      y: 10,
      numTrees: 50
    });
    forestbg2 = new Forest({
      ctx: bgctx,
      numTrees: 100,
      colorLuminanceOffset: -0.1,
      treeScaleX: 0.6,
      treeScaleY: 0.6
    });
    forestbg3 = new Forest({
      ctx: bgctx,
      numTrees: 100,
      colorLuminanceOffset: -0.2,
      treeScaleX: 0.7,
      treeScaleY: 0.7
    });
    forestbg4 = new Forest({
      ctx: bgctx,
      numTrees: 100,
      colorLuminanceOffset: -0.3,
      treeScaleX: 0.7,
      treeScaleY: 0.7
    });
    forestbg5 = new Forest({
      ctx: bgctx,
      numTrees: 100,
      colorLuminanceOffset: -0.4,
      treeScaleX: 0.7,
      treeScaleY: 0.7
    });

    wavysky.draw();
    wavysky.getAsImage();

    // create birdnest image for optimization
    var bncanvas = createCanvas(44, 30);
    var bnctx = bncanvas.getContext('2d');
    var birdnest = new BirdNest({
      ctx: bnctx,
      x: 22,
      y: 15,
      hidden: false
    });
    birdnest.draw();
    getCanvasAsImage(bncanvas, 'birdnest', 44, 30);
    document.addEventListener('image-loaded-birdnest', function (event) {
      if(birdnest){ birdnest.image = event.image; }
      var len = terry.tree.branches.length;
      for (var i = 0; i < len; i++) {
        if (terry.tree.branches[i] && terry.tree.branches[i].birdNest) {
          terry.tree.branches[i].birdNest.image = event.image;
        }
      }
      bncanvas = bnctx = birdnest = null;
    }, false);


    // create speechbubble image for optimization
    var sbcanvas = createCanvas(250, 80);
    var sbctx = sbcanvas.getContext('2d');
    var speech1 = new SpeechBubble({
      ctx: sbctx,
      msg1: "OH NO! That nasty bear",
      msg2: "is about to rip me apart!",
      width: 250,
      height: 80,
      dur: 3000
    });
    speech1.draw();
    getCanvasAsImage(sbcanvas, 'speech1', speech1.width, speech1.height);
    document.addEventListener('image-loaded-speech1', function (event) {
      if(speech1){ speech1.image = event.image; }
      speech1.ctx = ctx;
      terry.speechBubbles['opening'] = speech1;
      sbcanvas = null;
      sbctx = null;
    }, false);


    var sbcanvas2 = createCanvas(250, 100);
    var sbctx2 = sbcanvas2.getContext('2d');
    var speech2 = new SpeechBubble({
      ctx: sbctx2,
      msg1: "Better climb this tree",
      msg2: "to escape and save those",
      msg3: "poor bird's nests!",
      width: 250,
      height: 100
    });
    speech2.draw();
    getCanvasAsImage(sbcanvas2, 'speech2', speech2.width, speech2.height);
    document.addEventListener('image-loaded-speech2', function (event) {
      if(speech2){ speech2.image = event.image; }
      speech2.ctx = ctx;
      terry.speechBubbles['opening2'] = speech2;
      sbcanvas2 = null;
      sbctx2 = null;
    }, false);

    var sbcanvas3 = createCanvas(250, 100);
    var sbctx3 = sbcanvas3.getContext('2d');
    var speech3 = new SpeechBubble({
      ctx: sbctx3,
      msg1: "Gotta chop down this",
      msg2: "tree and finally put that",
      msg3: "bear to rest!",
      width: 250,
      height: 100
    });
    speech3.draw();
    getCanvasAsImage(sbcanvas3, 'speech3', speech3.width, speech3.height);
    document.addEventListener('image-loaded-speech3', function (event) {
      if(speech3){ speech3.image = event.image; }
      speech3.ctx = ctx;
      terry.speechBubbles['end'] = speech3;
      sbcanvas3 = null;
      sbctx3 = null;
    }, false);



    var forests = [forestbg, forestbg2, forestbg3, forestbg4, forestbg5];
    for (var i in forests) {
      bgctx.clearRect(0, 0, W, H);
      forests[i].draw();
      forests[i].getAsImage();
    }
    chipsctx.clearRect(0, 0, W, H);
    bgctx.clearRect(0, 0, W, H);
    ground.draw();
    ground.drawDirtPatch({
      x: tree.x + tree.width * 0.5,
      y: 30
    });
    ground.getAsImage();


    // bind to the event.
    if(!bgLoaded){
      document.addEventListener('layers-loaded', function () {
        var bgItems = [wavysky,forestbg5, forestbg4, forestbg3, forestbg2, forestbg,ground];
        for (var i in bgItems) {
          bgctx.drawImage(bgItems[i].image, 0, 0, W, H, 0, 0, W, H);
        }
        bgLoaded = true;
      }, false);
    }


    scoreBoard = new ScoreBoard({
      ctx: scorectx,
      x: 20,
      y: 25,
      score: 0,
      width: scorecanvas.width,
      height: scorecanvas.height
    });
    scoreBoard.draw();

    document.onkeydown = function (event) {
      event.preventDefault();
      var keyCode = event.keyCode;
      keysDown[keyCode] = true;
    };
    document.onkeyup = function (event) {
      event.preventDefault();
      var keyCode = event.keyCode;
      keysDown[keyCode] = false;
    };
    ctxTweener = new Tweener();

    if(!isPlaying){ step(); }
    isPlaying = true;
  }

  function step(timestamp, timeOffset) {
    if (isPaused) {
      return;
    }

    // updates score
    if (scoreInterval < curTime) {
      scoreBoard.updateScore(terry.getScore());
      scoreInterval = curTime + 300;
    }

    // updates all animation times with the paused offset time
    if (timeOffset > 0) {
      terry.restStartTime += timeOffset;
      terry.restingTime += timeOffset;
      terry.jumpStartTime += timeOffset;
      terry.jumpEndTime += timeOffset;
      terry.jumpTime += timeOffset;
      terry.runStartTime += timeOffset;
      terry.runTime += timeOffset;
      terry.attackStartTime += timeOffset;
      terry.attackEndTime += timeOffset;
      terry.attackTime += timeOffset;
      terry.dropStartTime += timeOffset;
      terry.dropEndTime += timeOffset;
      terry.dropTime += timeOffset;
      ctxTweener.offset(timeOffset);
    }
    
    curTime = timestamp;

    // clear stage
    ctx.clearRect(0, 0, W, H);
    treectx.clearRect(0, 0, W, H);
    bgctx.clearRect(0, 0, W, H);
    bctx.clearRect(0,0, W,H);

    // viewport positioning
    ctx.save();
    bctx.save();
    treectx.save();

    if (terry.y < 100) {
      //-- mc.y += (newPos - mc.y) * .2
      viewY = viewY + ((-terry.y + 200 - viewY) * 0.02);
    } else {
      viewY = viewY + ((0 - viewY) * 0.2);
    }

    ctx.translate(viewX, viewY);
    bctx.translate(viewX, viewY);
    treectx.translate(viewX, viewY);
    chipscanvas.style.top = viewY + "px"; // not clearing canvas, so use css positioning

    tree.draw();
    terry.draw();
    bird.draw();
    bear.draw();
    ctxTweener.update(timestamp);

    if (bgLoaded && wavysky.image) {
      bgctx.drawImage(wavysky.image, 0, 0, W, H, 0, 0, W, H);
      bgctx.drawImage(forestbg5.image, 0, 0, W, H, 0, viewY * 0.2, W, H);
      bgctx.drawImage(forestbg4.image, 0, 0, W, H, 0, viewY * 0.3, W, H);
      bgctx.drawImage(forestbg3.image, 0, 0, W, H, 0, viewY * 0.5, W, H);
      bgctx.drawImage(forestbg2.image, 0, 0, W, H, 0, viewY * 0.7, W, H);
      bgctx.drawImage(forestbg.image, 0, 0, W, H, 0, viewY * 1.1, W, H);
      bgctx.drawImage(ground.image, 0, 0, W, H, 0, viewY, W, H);
    }

    ctx.restore();
    bctx.restore();
    treectx.restore();
    // end viewport positioning


    // input controls
    if (keysDown[37] || keysDown[65]) {
      terry.triggerAnimation('run', {
        isRight: false
      });
    } else if (keysDown[39] || keysDown[68]) {
      terry.triggerAnimation('run', {
        isRight: true
      });
    } else {
      terry.triggerAnimation('rest');
    }
    if (keysDown[40] || keysDown[83]) {
      terry.triggerAnimation('dropdown');
    }
    if (keysDown[38] || keysDown[87]) {
      terry.triggerAnimation('jump');
    }
    if (keysDown[32]) {
      terry.triggerAnimation('action');
    }

    // request new frame
    requestAnimFrame(step);
    lastTime = curTime;
  }


  function toggleGamePause() {
    var pausedTime, date = new Date();
    var curTime = date.getTime();
    var btn = $("btn-toggle-pause");
    if (btn.className === "") {
      btn.className = "play";
      isPaused = true;

      pausedTime = curTime;
      btn.setAttribute('data-pausedTime', pausedTime);
      $("cover").className = "on";
    } else {
      btn.className = "";
      isPaused = false;
      pausedTime = btn.getAttribute('data-pausedTime');
      var pausedOffset = curTime - pausedTime;
      step(curTime, pausedOffset);
      $("cover").className = "";
    }
  }

  function Terry(options) {
    this.ctx = ctx;
    for (var attrname in options) {
      this[attrname] = options[attrname];
    }
    this.init();
  }
  Terry.prototype = {
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    height: 70,
    r: 0,
    scaleX: 1,
    scaleY: 1,
    bodyParts: null,
    headSize: 13,
    hairColor: "#6D471B",
    hatColor: "#191E82",
    skinColor: "#FBE1BC",
    shirtColor: "#7F7F7F",
    pantsColor: "#454545",
    shoeColor: "#AB8726",
    headY: 30,
    beardLen: 15,
    beardW: 25,
    eyeSize: 2,
    eyeColor: "#111",
    eyeBrowThickness: 2,
    eyeSpread: 2,
    bodyW: 18,
    bodyH: 17,
    bodyY: 30,
    pantsH: 6,
    legW: 7,
    legH: 15,
    shoeW: 12,
    shoeH: 6,
    armH: 19,
    armW: 5,
    handSize: 4,
    armY: 30,
    axeW: 4,
    axeH: 40,
    axeHeadW: 16,
    axeHeadStartH: 8,
    axeHeadEndH: 10,
    axeHandleColor: "#603C0E",
    axeHeadColor: "#B00",
    axeHeadEdgeColor: "#EEE",
    animFunc: null,
    gravityY: 8,

    attackPower: 10,
    attackRadius: 20,
    attackPosition: {},

    jumpHeight: 140,
    groundY: 300,
    initialGroundY: 0,
    tree: null,
    highestTraveled: 0,
    speechBubbles: null,

    init: function () {
      var _ = this;
      var _y = 0;
      _y = -4;
      //hat
      _.hat = new Circle(0, _y - 2, _.headSize + 2, _.hatColor, 180, 360, 1, 1.6);

      //ears
      _y = -10;
      _.ears = new DisplayObject(new Circle(-_.headSize, _y - 1, _.headSize * 0.3, _.skinColor), new Circle(_.headSize, _y - 1, _.headSize * 0.3, _.skinColor));

      //headShape
      _y = -10;
      var grd = ctx.createLinearGradient(0, _y * 0.5, 0, _.headSize * 2 + _y * 0.5);
      grd.addColorStop(0, _.skinColor);
      grd.addColorStop(1, "#B8A07C");
      _.headShape = new Circle(0, _y, _.headSize, grd);

      //beard
      _y = -11;
      _.beard = new CustomShape(function () {
        ctx.beginPath();
        ctx.curveTo(-_.headSize, _y, - _.beardW * 0.5, _y + _.beardLen, 0, _y + _.beardLen);
        ctx.curveTo(0, _y + _.beardLen, _.beardW * 0.5, _y + _.beardLen, _.headSize, _y);
        ctx.curveTo(_.headSize, _y, _.beardW * 0.5, _y + _.beardLen * 0.3, 0, _y + _.beardLen * 0.3);
        ctx.curveTo(0, _y + _.beardLen * 0.3, - _.beardW * 0.5, _y + _.beardLen * 0.3, - _.headSize, _y);
        ctx.fillStyle = _.hairColor;
        ctx.fill();
        ctx.closePath();
      });

      //brows
      _y = -14;
      _.browL = new DisplayObject(new Rect(-_.eyeSize * 3 * 0.5, - _.eyeBrowThickness * 0.5, _.eyeSize * 3, _.eyeBrowThickness, 0, _.hairColor));
      _.browL.x = _.eyeSize * 3 * 0.5 + _.eyeSpread * 0.5;
      _.browL.y = _y + _.eyeBrowThickness * 0.5 - 3;
      _.browL.r = 20;

      _.browR = new DisplayObject(new Rect(-_.eyeSize * 3 * 0.5, - _.eyeBrowThickness * 0.5, _.eyeSize * 3, _.eyeBrowThickness, 0, _.hairColor));
      _.browR.x = -_.eyeSize * 3 * 0.5 - _.eyeSpread * 0.5;
      _.browR.y = _y + _.eyeBrowThickness * 0.5 - 3;
      _.browR.r = -20;

      _.brows = new DisplayObject(_.browL, _.browR);

      //eyes
      _.eyes = new DisplayObject(new Rect(-_.eyeSpread - _.eyeSize, _y, _.eyeSize, _.eyeSize, 0, _.eyeColor), new Rect(_.eyeSpread, _y, _.eyeSize, _.eyeSize, 0, _.eyeColor));

      //mouth
      _y = -10;
      _.mouth = new DisplayObject(new Rect(-_.headSize * 0.5 - 2, _y, _.headSize + 4, 2, 0, _.hairColor), new Rect(-_.headSize * 0.5 - 2, _y, 2, 4, 0, _.hairColor), new Rect(_.headSize * 0.5, _y, 2, 4, 0, _.hairColor));

      //head
      _.head = new DisplayObject(_.hat, _.ears, _.headShape, _.beard, _.brows, _.eyes, _.mouth);
      _.head.y = _.headY;

      //body
      _.body = new DisplayObject(new Rect(-_.bodyW * 0.5, _.bodyY + _.pantsH, _.bodyW, _.bodyH, 0, _.pantsColor), new Rect(-_.bodyW * 0.5, _.bodyY, _.bodyW, _.bodyH, 0, _.shirtColor));

      //footL
      _.footL = new Rect(-_.legW * 0.5 - _.shoeW * 0.5 + 2, _.legH - 2, _.shoeW, _.shoeH, 0, _.shoeColor);

      //legL
      _.legL = new DisplayObject(new Rect(-_.legW * 0.5, - 2, _.legW, _.legH, 0, _.pantsColor), _.footL);
      _.legL.x = -_.bodyW * 0.5 + _.legW * 0.5;
      _.legL.y = _.bodyY + _.pantsH + _.legH;

      //footR
      _.footR = new Rect(-_.shoeW * 0.5 - 2 + _.legW * 0.5, _.legH - 2, _.shoeW, _.shoeH, 0, colorLuminance(_.shoeColor, - 0.1));

      //legR
      _.legR = new DisplayObject(new Rect(-_.legW + _.legW * 0.5, - 2, _.legW, _.legH, 0, _.pantsColor), _.footR);
      _.legR.x = _.bodyW * 0.5 - _.legW * 0.5;
      _.legR.y = _.bodyY + _.pantsH + _.legH;

      //axe
      _.axeHead = new DisplayObject(new CustomShape(function () {
        ctx.beginPath();
        ctx.lineTo(0, 0);
        ctx.lineTo(_.axeHeadW, 4 + _.axeHeadEndH * 0.5);
        ctx.lineTo(_.axeHeadW, - _.axeHeadStartH - _.axeHeadEndH * 0.5);
        ctx.lineTo(0, - _.axeHeadStartH);
        ctx.fillStyle = _.axeHeadColor;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.lineTo(_.axeHeadW, 4 + _.axeHeadEndH * 0.5);
        ctx.lineTo(_.axeHeadW, - _.axeHeadStartH - _.axeHeadEndH * 0.5);
        ctx.lineTo(_.axeHeadW + 3, - _.axeHeadStartH - _.axeHeadEndH * 0.5);
        ctx.lineTo(_.axeHeadW + 3, 4 + _.axeHeadEndH * 0.5);
        ctx.fillStyle = _.axeHeadEdgeColor;
        ctx.fill();
        ctx.closePath();
      }));
      _.axeHead.x = _.axeW - _.axeW * 0.5;
      _.axeHead.y = _.axeH - _.axeHeadStartH * 0.5;

      _.axe = new DisplayObject(new Rect(-2, - 4, _.axeW, _.axeH, 0, _.axeHandleColor), _.axeHead);
      _.axe.r = 80;
      _.axe.x = -_.axeW * 0.5;
      _.axe.y = _.armH;

      //armL
      _.armL = new DisplayObject(new Rect(-_.armW * 0.5, 0, _.armW, _.armH, 10, _.shirtColor), new Circle(-_.handSize * 0.5, _.armH, _.handSize, _.skinColor), _.axe);
      _.armL.x = -_.bodyW * 0.5 - _.armW * 0.5;
      _.armL.y = _.armY;
      //armR
      _.armR = new DisplayObject(new Rect(-_.armW + _.armW * 0.5, 0, _.armW, _.armH, - 10, _.shirtColor), new Circle(_.handSize * 0.5, _.armH, _.handSize, _.skinColor));
      _.armR.x = _.bodyW * 0.5 + _.armW * 0.5;
      _.armR.y = _.armY;


      _.attackPosition = {
        x: _.armH + _.axeH - _.axeHeadStartH,
        y: _.armY + _.armH - 25
      };
      _.bodyParts = new DisplayObject(_.legL, _.legR, _.armR, _.body, _.head, _.armL);
      _.bodyParts.autoZ();
      _.initialGroundY = _.groundY;

      _.triggerAnimation('rest');
      _.speechBubbles = [];
    },
    run: function () {
      var _ = this;
      _.axe.scaleY = -1;
      _.footL.x = -this.legW * 0.5 - _.shoeW * 0.5 + 5;

      _.runTime = curTime - _.runStartTime;

      if (_.vy !== 0) {
        _.legL.r = 50;
        _.legR.r = -80;
        if (!_.isAttacking) {
          _.armL.r = -70;
          _.armR.r = 80;
        }
        _.isDropDown = true;
        return false;
      }
      if (_.isRunUp) {
        _.runUp();
      } else {
        _.runDown();
      }
    },
    runUp: function () {
      var _ = this;
      var dur = 190;
      _.legL.r = tween(_.runTime, - 70, 70, dur, Math.easeLinear);
      _.legR.r = tween(_.runTime, 80, - 80, dur, Math.easeLinear);
      if (!_.isAttacking) {
        _.armL.r = tween(_.runTime, 70, - 70, dur, Math.easeLinear);
        _.armR.r = tween(_.runTime, - 80, 80, dur, Math.easeLinear);
      }
      _.head.r = tween(_.runTime, 5, - 5, dur, Math.easeLinear);
      _.head.y = tween(_.runTime, _.headY + 2, _.headY - 2, dur, Math.easeLinear);

      if (_.runTime > dur) {
        _.runStartTime = curTime;
        _.runTime = 0;
        _.isRunUp = false;
      }
    },
    runDown: function () {
      var _ = this;
      var dur = 190;
      _.legL.r = tween(_.runTime, 70, - 70, dur, Math.easeLinear);
      _.legR.r = tween(_.runTime, - 80, 80, dur, Math.easeLinear);
      if (!_.isAttacking) {
        _.armL.r = tween(_.runTime, - 70, 70, dur, Math.easeLinear);
        _.armR.r = tween(_.runTime, 80, - 80, dur, Math.easeLinear);
      }
      _.head.r = tween(_.runTime, - 5, 5, dur, Math.easeLinear);
      _.head.y = tween(_.runTime, _.headY - 2, _.headY + 2, dur, Math.easeLinear);

      if (_.runTime > dur) {
        _.runStartTime = curTime;
        _.runTime = 0;
        _.isRunUp = true;
      }
    },
    jump: function () {
      var _ = this;
      _.footL.x = -this.legW * 0.5 - _.shoeW * 0.5 + 5;
      _.axe.scaleY = -1;

      _.jumpTime = curTime - _.jumpStartTime;

      if (_.isJumpingUp) {
        _.jumpUp();
      } else {
        _.jumpDown();
      }
    },
    jumpUp: function () {
      var _ = this;
      var dur = 240;
      _.legL.r = tween(_.jumpTime, 0, 50, dur, Math.easeLinear);
      _.legR.r = tween(_.jumpTime, 0, - 80, dur, Math.easeLinear);
      if (!_.isAttacking) {
        _.armL.r = tween(_.jumpTime, 0, - 70, dur, Math.easeLinear);
        _.armR.r = tween(_.jumpTime, 0, 80, dur, Math.easeLinear);
      }

      _.y = tween(_.jumpTime, _.groundY, _.groundY - _.jumpHeight, dur, Math.easeOutCubic);

      if (_.jumpTime > dur) {
        _.jumpStartTime = curTime;
        _.jumpTime = 0;
        _.isJumpingUp = false;
      }
    },
    jumpDown: function () {
      var _ = this;
      var dur = 200;

      _.legL.r = 50;
      _.legR.r = -80;
      if (!_.isAttacking) {
        _.armL.r = -70;
        _.armR.r = 80;
      }

      if (_.jumpTime > dur) {
        _.armL.r = -70;
        _.armR.r = 80;
        _.jumpStartTime = curTime;
        _.jumpTime = 0;
        _.isJumpingUp = false;
      }
    },
    drop: function () {
      var _ = this;
      _.axe.scaleY = -1;

      _.dropTime = curTime - _.dropStartTime;
      _.dropDown();
    },
    dropDown: function () {
      var _ = this;
      var dur = 200;

      _.legL.r = 50;
      _.legR.r = -80;
      if (!_.isAttacking) {
        _.armL.r = -70;
        _.armR.r = 80;
      }

      if (_.y > _.groundY) {
        _.dropStartTime = 0;
        _.dropTime = 0;
      }
    },
    action: function () {
      var _ = this;
      _.armR.z = 6;
      _.bodyParts.refreshOrder();
      _.axe.scaleY = 1;

      _.attackTime = curTime - _.attackStartTime;

      if (_.canSearch) {
        _.isSearching = true;
        _.searchUp();
      } else {
        _.actionUp();
      }
    },

    searchUp: function () {
      var _ = this;
      var dur = 800;
      _.head.r = 20;
      _.head.x = 10;
      _.head.y = 28;
      _.mouth.y = 1;
      _.browL.r = 30;
      _.browR.r = -30;
      _.body.r = 24;
      _.body.x = 20;
      _.body.y = 2;
      _.legL.r = 40;
      _.legL.y = 47;
      _.armL.x = 0;
      _.armL.y = 25;
      _.armR.x = 16;
      _.armR.y = 35;
      if (_.attackTime < dur * 0.5) {
        _.armL.r = tween(_.attackTime, 40, 50, dur, Math.easeLinear);
        _.armR.r = tween(_.attackTime, - 50, 50, dur, Math.easeLinear);
      } else {
        _.armL.r = tween(_.attackTime, 50, 40, dur, Math.easeLinear);
        _.armR.r = tween(_.attackTime, 50, - 50, dur, Math.easeLinear);
      }

      if (_.attackTime > dur) {
        //reset
        _.attackTime = 0;
        _.attackStartTime = curTime;
        _.isAttacking = false;
        _.isSearching = false;

        if (_.onBranch.birdNest) {
          _.onBranch.birdNest.revealAndRemoveFrom(_.onBranch,_.x);

          _.tree.numBirdNestsFound += 1;
        }

        if (_.isRunning || _.isResting) {
          _.reset();
        }
      }
    },

    actionUp: function () {
      var _ = this;
      var dur = 260;
      _.mouth.y = 1;
      _.browL.r = tween(_.attackTime, - 10, 0, dur, Math.easeLinear);
      _.browR.r = tween(_.attackTime, 10, 0, dur, Math.easeLinear);
      _.axe.r = tween(_.attackTime, 80, 10, dur, Math.easeLinear);
      _.axe.scaleY = tween(_.attackTime, 0.5, 1, dur, Math.easeLinear);
      _.armL.r = tween(_.attackTime, 70, - 110, dur, Math.easeLinear);
      _.armL.x = tween(_.attackTime, - _.bodyW * 0.5 - _.armW * 0.5, - _.bodyW * 0.5 - _.armW * 0.5 + 15, dur, Math.easeLinear);
      _.armL.y = tween(_.attackTime, _.armY, _.armY + 15, dur, Math.easeLinear);
      _.armR.r = tween(_.attackTime, 90, - 50, dur, Math.easeLinear);
      _.armR.x = tween(_.attackTime, _.bodyW * 0.5 + _.armW * 0.5 - 14, _.bodyW * 0.5 + _.armW * 0.5, dur, Math.easeLinear);
      _.armR.y = tween(_.attackTime, _.armY + 10, _.armY, dur, Math.easeLinear);


      if (_.attackTime > dur) {
        //reset
        _.attackTime = 0;
        _.axe.x = -_.axeW * 0.5;
        _.axe.y = _.armH;
        _.mouth.y = 0;
        _.browL.r = 20;
        _.browR.r = -20;
        _.axe.r = 80;
        _.axe.scaleY = 1;
        _.armL.r = 0;
        _.armL.x = -_.bodyW * 0.5 - _.armW * 0.5;
        _.armL.y = _.armY;
        _.armR.r = 0;
        _.armR.x = _.bodyW * 0.5 + _.armW * 0.5;
        _.armR.y = _.armY;
        AttackDetail = {
          power: _.attackPower,
          radius: _.attackRadius,
          x: _.x + (_.attackPosition.x * _.scaleX),
          y: _.y + _.attackPosition.y
        };
        _.isAttacking = false;
      }
    },
    stop: function () {
      var _ = this;
      _.legL.r = 0;
      _.legR.r = 0;
      _.armL.r = 0;
      _.armR.r = 0;
      _.head.r = 0;

      _.armR.z = 2;
      _.bodyParts.refreshOrder();
      _.axe.scaleY = 1;

      _.restingTime = curTime - _.restStartTime;

      if (_.isRestUp) {
        _.restUp();
      } else {
        _.restDown();
      }
    },
    restUp: function () {
      var _ = this;
      var dur = 300;
      if (!_.isAttacking) {
        _.armL.y = tween(_.restingTime, _.armY, _.armY + 0.5, dur, Math.easeInOutCubic);
        _.armR.y = tween(_.restingTime, _.armY, _.armY + 0.5, dur, Math.easeInOutCubic);
        _.head.y = tween(_.restingTime, _.headY + 1, _.headY - 0, dur, Math.easeLinear);
      }

      if (_.restingTime > dur) {
        _.restStartTime = curTime;
        _.restingTime = 0;
        _.isRestUp = false;
      }
    },
    restDown: function () {
      var _ = this;
      var dur = 300;
      if (!_.isAttacking) {
        _.armL.y = tween(_.restingTime, _.armY + 0.5, _.armY, dur, Math.easeInOutCubic);
        _.armR.y = tween(_.restingTime, _.armY + 0.5, _.armY, dur, Math.easeInOutCubic);
        _.head.y = tween(_.restingTime, _.headY - 0, _.headY + 1, dur, Math.easeLinear);
      }

      if (_.restingTime > dur) {
        _.restStartTime = curTime;
        _.restingTime = 0;
        _.isRestUp = true;
      }
    },
    triggerAnimation: function (type, options) {
      var _ = this;
      if (_.isSearching) {
        _.vx = 0;
        _.animFunc = _.stop;
        _.isRunning = false;
        return;
      }
      // update running speed
      if (options) {
        if (options.isRight) {
          _.scaleX = 1;
          _.vx = 4;
        } else {
          _.scaleX = -1;
          _.vx = -4;
        }
      }
      switch (type) {
      case "rest":
        if (!_.isResting && !_.isJumping && !_.isDropDown && !_.isSearching) {
          _.isResting = true;
          _.restStartTime = curTime;
          _.animFunc = _.stop;
          _.isRunning = false;
          _.jumpEndTime = 0;
          _.reset();
        }
        _.vx = 0;
        break;
      case "jump":
        if (!_.isJumping && _.y == _.groundY) {
          _.isJumping = true;
          _.isRunning = false;
          _.isResting = false;
          _.jumpStartTime = curTime;
          _.animFunc = _.jump;
          _.isJumpingUp = true;
          _.jumpEndTime = curTime + 440;
        }
        break;
      case "run":
        if (!_.isRunning && !_.isJumping && !_.isSearching) {
          _.isRunning = true;
          _.isResting = false;
          _.isJumping = false;
          _.runStartTime = curTime;
          _.animFunc = _.run;
          _.isRunUp = true;
        }
        break;
      case "action":
        if (!_.isAttacking) {
          _.isAttacking = true;
          _.isResting = false;
          _.attackStartTime = curTime;
          _.attackEndTime = curTime + 260;
        }
        break;
      case "dropdown":
        if (!_.isDropDown && !_.isJumping && _.y <= _.groundY) {
          _.isDropDown = true;
          _.isDropNextBranch = true;
          _.groundY = _.groundY;

          _.isJumping = false;
          _.isRunning = false;
          _.isResting = false;
          _.dropStartTime = curTime;
          _.animFunc = _.drop;
          _.dropEndTime = curTime + 200;
        }
        break;
      default:
        break;
      }
    },
    update: function () {
      var _ = this;
      _.animFunc();
      if (_.isAttacking) {
        _.action();
      }
      if (_.y < _.groundY) {
        var d = (curTime - lastTime) * 0.002;
        _.vy = _.vy + _.gravityY * d;
      } else {
        _.vy = 0;
        _.y = _.groundY;
        _.isDropDown = false;

        _.jumpStartTime = curTime;
        _.jumpTime = 0;
        _.isJumpingUp = false;
        _.isJumping = false;
      }
      // update highestTraveled score
      var curHeight = -(_.y - _.initialGroundY);
      if (curHeight > _.highestTraveled) {
        _.highestTraveled = curHeight;
      }

      if(!_.tree.isTreeChopped){
        // tree branches
        _.onBranch = null;
        var playerY = _.y + _.height;
        var len = _.tree.branches.length;
        for (var i = 0; i < len; i++) {
          var branch = _.tree.branches[i];

          if (branch && playerY <= branch.y && _.x > branch.x - 10 && _.x < branch.x + branch.width + 10) {
            if (_.onBranch) {
              if (branch.y < _.onBranch.y) {
                _.onBranch = branch;
              }
            } else {
              _.onBranch = branch;
            }
            if (!_.isJumpingUp) {
              _.groundY = branch.y - _.height;
            }
          }
          //branch.fill = "#333"; branch.draw();
        }
        /*
          if(_.onBranch){
            _.onBranch.fill = "#FF0000"; _.onBranch.draw();
          }
          */
        // drops to next lowest branch
        if (_.isDropNextBranch) {
          _.onBranch = null;
          _.groundY = _.initialGroundY;
          _.isDropNextBranch = false;
        }

        // land player on branch underneath him
        if (_.onBranch && _.isDropDown) {
          _.groundY = _.onBranch.y - _.height;
        }

        // if player walks off current branch
        if (!_.onBranch && !_.isJumpingUp) {
          _.groundY = _.initialGroundY;
        }

        if (_.onBranch && !_.isDropDown && _.onBranch.hasBush && !_.isJumping) {
          if (_.onBranch.onLeft) {
            if (_.x - _.onBranch.x < 80) {
              _.canSearch = true;
            } else {
              _.canSearch = false;
            }
          } else {
            if (_.onBranch.x + _.onBranch.width - _.x < 80) {
              _.canSearch = true;
            } else {
              _.canSearch = false;
            }
          }
        } else {
          _.canSearch = false;
        }
      }

      _.x = _.x + _.vx;
      _.y = _.y + _.vy;

      _.bodyParts.x = _.x;
      _.bodyParts.y = _.y;
      _.bodyParts.r = _.r;
      _.bodyParts.scaleX = _.scaleX;
      _.bodyParts.scaleY = _.scaleY;

      // bear start chasing
      if(!_.tree.bear.hasStarted && _.y<-200){
        _.tree.bear.start();
      }
    },
    draw: function () {
      var _ = this;
      _.update();
      _.bodyParts.draw();

      var speech1 = _.speechBubbles['opening'];
      var speech2 = _.speechBubbles['opening2'];
      var speech3 = _.speechBubbles['end'];
      if(speech1){
        speech1.x = _.x;
        speech1.y = _.y;
      }
      if(speech2){
        speech2.x = _.x;
        speech2.y = _.y;
      }
      if(speech3){
        speech3.x = _.x;
        speech3.y = _.y;
      }
      if(speech1 && !_.speech1Triggered){
        ctxTweener.add(speech1, {prop:'opacity', start:0, end:1 }, curTime+500, 500, Math.easeOutCubic);

        ctxTweener.add(speech1, {}, curTime+1000, 4000, Math.easeOutCubic);

        ctxTweener.add(speech2, {}, curTime+5000, 4000, Math.easeOutCubic);

        ctxTweener.add(speech2, {prop:'opacity', start:1, end:0}, curTime+9000, 500, Math.easeOutCubic);

        _.speech1Triggered = true;
      }
      if(_.y>_.tree.bear.y && !_.endTriggered){
        ctxTweener.add(speech3, {prop:'opacity', start:0, end:1}, curTime+2000, 500, Math.easeOutCubic);
        ctxTweener.add(speech3, {}, curTime+2500, 4000, Math.easeOutCubic);
        _.endTriggered = true;
      }
    },
    reset: function () {
      var _ = this;
      _.legL.r = _.legR.r = _.armL.r = _.armR.r = _.head.r = _.head.x = _.mouth.y = _.body.r = _.body.x = _.body.y = 0;
      _.head.y = 30.82;
      _.browL.r = 20;
      _.browR.r = -20;
      _.legL.y = 51;
      _.armL.x = -11.5;
      _.armL.y = _.armR.y = 30;
      _.armR.x = 11.5;
    },
    getScore: function () {
      var _ = this;
      return _.tree.numBirdNestsFound * 500 + parseInt(_.highestTraveled);
    }
  };


  function WavySky(options) {
    this.ctx = ctx;
    for (var attrname in options) {
      this[attrname] = options[attrname];
    }
    this.init();
  }
  WavySky.prototype = {
    ctx: null,
    bg: null,
    gStartXOffset: -90,
    gEndXOffset: 200,
    lightBgColor: "#b4ecf7",
    darkBgColor: "#91c2f7",
    numOfStripes: 10,
    cp1: {
      x: 150,
      y: 100
    },
    cp2: {
      x: 200,
      y: 350
    },
    imageData: null,
    dataURL: null,
    image: null,
    init: function () {
      var _ = this;
      _.drawBg();
      _.ccp1 = {
        x: 0,
        y: 0
      };
      _.ccp2 = {
        x: 0,
        y: 0
      };
      _.startXOffsets = [];
      _.endXOffsets = [];
      _.cp1s = [];
      _.cp2s = [];
      _.isStripe = [];
      for (var i = 0; i < _.numOfStripes; i++) {
        _.startXOffsets[i] = getRandInt(10, 100);
        _.endXOffsets[i] = getRandInt(50, 300);
        _.cp1s[i] = getRandInt(50, 300);
        _.cp2s[i] = getRandInt(50, 300);
        _.isStripe[i] = random() < 0.6;
      }
    },
    getAsImage: getAsImage,
    drawBg: function () {
      //createRadialGradient(startX, startY, startRadius, endX, endY, endRadius);
      var grd = this.ctx.createRadialGradient(50, 350, 100, 50, 350, 900);
      grd.addColorStop(0, this.lightBgColor);
      grd.addColorStop(1, this.darkBgColor);
      this.bg = new Rect(0, 0, W, H, 0, grd);
      this.bg.ctx = this.ctx;
    },
    drawStripe: function () {
      var _ = this;
      _.ctx.beginPath();
      //cp1x, cp1y, cp2x, cp2y, x, y
      _.ccp1.x = _.ccp1.x + _.startXOffsets[_.curStripeNum];
      _.ccp2.x = _.ccp2.x + _.endXOffsets[_.curStripeNum];

      var start = {
        x: _.cStartXOffset,
        y: H
      };
      var end = {
        x: _.cEndXOffset,
        y: 0
      };

      var startXOffset = _.startXOffsets[_.curStripeNum]; //start.x+getRandInt(10,90);
      var endXOffset = _.endXOffsets[_.curStripeNum]; //end.x+getRandInt(10,90);

      _.ctx.moveTo(start.x, start.y);
      _.ctx.curveTo(_.ccp1.x, _.ccp1.y, _.ccp2.x, _.ccp2.y, end.x, end.y);
      _.ctx.lineTo(end.x + endXOffset, 0);
      _.ctx.curveTo(_.ccp2.x, _.ccp2.y, _.ccp1.x, _.ccp1.y, start.x + startXOffset, start.y);

      var grd = _.ctx.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, "rgba(255,255,255,.05)");
      grd.addColorStop(1, "rgba(255,255,255,.1)");

      _.ctx.fillStyle = grd;
      if (this.isStripe[_.curStripeNum]) {
        _.ctx.fill();
      }
      _.ctx.closePath();

      _.cStartXOffset = _.cStartXOffset + startXOffset;
      _.cEndXOffset = _.cEndXOffset + endXOffset;
    },
    draw: function () {
      var _ = this;
      _.cStartXOffset = _.gStartXOffset;
      _.cEndXOffset = _.gEndXOffset;
      _.ccp1.x = _.cp1.x;
      _.ccp1.y = _.cp1.y;
      _.ccp2.x = _.cp2.x;
      _.ccp2.y = _.cp2.y;

      _.bg.draw();
      _.curStripeNum = 0;
      for (var i = 0; i < _.numOfStripes; i++) {
        _.drawStripe();
        _.curStripeNum = _.curStripeNum + 1;
      }
    }
  };

  function GrassGround(options) {
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }
    _.init();
  }
  GrassGround.prototype = {
    ctx: null,
    x: 0,
    y: 0,
    ground: null,
    width: 800,
    height: 40,
    grassBladeNum: 200,
    grassLengthMin: 3,
    grassLengthMax: 5,
    image: null,
    init: function () {
      var _ = this;
      var grd = _.ctx.createLinearGradient(0, 0, 0, _.height);
      grd.addColorStop(0, "#b2ce70");
      grd.addColorStop(1, "#69612c");
      var rect = new Rect(0, 0, _.width, _.height, 0, grd);
      rect.ctx = _.ctx;
      _.ground = new DisplayObject(rect);
      _.ground.ctx = _.ctx;
    },
    getAsImage: getAsImage,
    drawDirtPatch: function (options) {
      var _ = this;
      var ctx = _.ctx;

      //createRadialGradient(startX, startY, startRadius, endX, endY, endRadius);

      var defaults = {
        x: 300,
        y: 10,
        radius: 300,
        fill: null,
        scaleX: 1,
        scaleY: 0.1
      };
      for (var attrname in options) {
        defaults[attrname] = options[attrname];
      }
      options = defaults;

      if (!options.fill) {
        var grd = this.ctx.createRadialGradient(0, 0, 0, 0, 0, options.radius);
        grd.addColorStop(0, "rgba(219, 205, 162,.8)");
        grd.addColorStop(1, "rgba(219, 205, 162,0)");
        options.fill = grd;
      }
      var patch = new DisplayObject(new Circle(0, 0, options.radius, options.fill));
      patch.ctx = ctx;
      patch.x = _.x + options.x;
      patch.y = _.y + options.y;
      patch.scaleX = options.scaleX;
      patch.scaleY = options.scaleY;
      patch.draw();
      patch.scaleX = options.scaleX + 0.4;
      patch.draw();

      for (var i = 0; i < 20; i++) {
        ctx.beginPath();
        var rx = patch.x + getRandInt(-options.radius, options.radius);
        var ry = patch.y + getRandInt(-5, 10);
        var rs = getRand(0.4, 1.5);
        var ra = getRand(0.05, 0.8);
        ctx.arc(rx, ry, rs, 0, TWO_PI);
        ctx.fillStyle = "rgba(100,100,100," + ra + ")";
        ctx.fill();
      }
    },
    draw: function () {
      var _ = this;
      var ctx = _.ctx;
      _.ground.x = _.x;
      _.ground.y = _.y;
      _.ground.draw();

      var i, rx, ry;
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = "#b2bc3e";
      for (i = 0; i < _.grassBladeNum; i++) {
        rx = getRandInt(_.x, _.width);
        ry = _.y; //getRandInt(_.y,_.y+_.height);
        ctx.beginPath();
        // ctx.lineTo(rx,ry);
        ctx.moveTo(rx, ry);
        ctx.curveTo(rx - getRandInt(-5, 9), ry - getRandInt(-5, 4), rx - getRandInt(-5, 9), ry - 2, rx - 4, ry - getRandInt(_.grassLengthMin, _.grassLengthMax));
        ctx.moveTo(rx, ry);
        ctx.curveTo(rx - getRandInt(-5, 9), ry - getRandInt(-5, 4), rx - getRandInt(-5, 9), ry - getRandInt(-5, 9), rx - 4, ry - getRandInt(_.grassLengthMin, _.grassLengthMax));
        ctx.stroke();
      }
    }
  };

  function ClimbableTree(options) {
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }
    _.init();
    _.bear.x = _.x;
  }
  ClimbableTree.prototype = {
    ctx: null,
    x: 0,
    y: 0,
    r: 0,
    tree: null,
    bear: null,
    width: 70,
    height: 5000,
    color: "#826d3f",
    fill: null,
    chipSize: {
      w: 4,
      h: 2
    },
    chops: [],
    numChips: 200,
    chipPool: [],
    activeChipPool: [],
    trunkHeightOffset: 35,
    trunkWidthOffset: 2,
    branches: [],
    maxNumBranches: 155,
    maxBranchWidth: 250,
    maxBranchHeightOffset: 110,
    weakSpots: [],
    numWeakSpots: 150,
    player: null,
    canopy: null,
    numBirdNests: 13,
    numBirdNestsFound: 0,
    chopBottomY: -36,
    bigTrunkChop: false,
    init: function () {
      var _ = this;

      for (var i = 0; i < _.numChips; i++) {
        var chip = new WoodChipParticle();
        chip.randomVelocity();
        _.chipPool.push(chip);
      }
      _.weakSpots = [];
      for (i = 0; i < _.numWeakSpots; i++) {
        var spot = new TreeKnot();
        spot.ctx = _.ctx;
        spot.x = getRandInt(5, _.width-5);
        spot.y = getRandInt(_.y - _.height - 200, _.y - 400);
        spot.size = getRand(0.3, 0.5);
        _.weakSpots.push(spot);
      }

      var birdNestCount = 0;
      var lastBranchY = _.y - 110;
      _.branches = [];
      for (i = 0; i < _.maxNumBranches; i++) {
        var onLeft = random() > 0.5 || i === 0;
        var branch = new ClimbableBranch({
          ctx: _.ctx,
          onLeft: onLeft,
          width: getRandInt(20, _.maxBranchWidth)
        });
        branch.x = onLeft ? _.x - branch.width -_.width*0.5 : _.x + _.width -_.width*0.5;
        if (i === 0) {
          branch.y = lastBranchY;
        } else {
          branch.y = lastBranchY - getRandInt(70, _.maxBranchHeightOffset);
        }
        branch.height = branch.width * 0.1;
        lastBranchY = branch.y;
        _.branches.push(branch);

        // add canopy at top of last branches
        if (lastBranchY - _.maxBranchHeightOffset - 400 < _.y - _.height) {
          _.canopy = new Canopy({
            ctx: _.ctx,
            y: lastBranchY - 350
          });
          break;
        }
      }
      // add bird nests randomly
      var b;
      while (birdNestCount != _.numBirdNests) {
        var len = _.branches.length - 1;
        for (i = len; i >= 0; i--) {
          b = _.branches[i];
          if (b.hasBush && random() > 0.7) {
            b.addBirdNest();
            birdNestCount = birdNestCount + 1;
            if (birdNestCount == _.numBirdNests) {
              break;
            }
          }
        }
      }

      // trunk gradient
      _.fill = ctx.createLinearGradient(0, 0, _.width, 0);
      _.fill.addColorStop(0, _.color);
      _.fill.addColorStop(0.2, colorLuminance(_.color, 0.1));
      _.fill.addColorStop(0.4, _.color);
      _.fill.addColorStop(1, colorLuminance(_.color, - 0.4));
      _.chops = [];
    },
    loadChips: function (num) {
      var _ = this;
      if (!num) {
        num = 50;
      }
      var chip, buffer = [];
      for (var i = 0; i < num; i++) {
        chip = _.chipPool.pop();
        _.activeChipPool.push(chip);
        buffer.push(chip);
      }
      return buffer;
    },
    draw: function () {
      var _ = this;
      var ctx = _.ctx;
      var a = AttackDetail;
      var i, len, chip, dx;

       // trunk
      ctx.save();
      ctx.rotate(0*DEG2RAD);
      ctx.translate(_.x-_.width*0.5, _.y);
      ctx.beginPath();
      ctx.moveTo(0, -_.trunkHeightOffset);
      ctx.lineTo(_.width, -_.trunkHeightOffset);
      ctx.curveTo(_.width + _.trunkWidthOffset, 0, _.width + _.trunkWidthOffset + 8, 0, _.width + _.trunkWidthOffset, 0);
      ctx.lineTo(-_.trunkWidthOffset, 0);
      ctx.curveTo(-_.trunkWidthOffset - 8, 0, - _.trunkWidthOffset, 0, 0, -_.trunkHeightOffset);

      // curved tree trunk bottom
      ctx.save();
      ctx.moveTo(-_.trunkWidthOffset,0);
      ctx.curveTo(_.width*0.5+_.trunkWidthOffset,10, _.width*0.5+_.trunkWidthOffset,10, _.width+_.trunkWidthOffset,0);
      ctx.restore();

      ctx.fillStyle = _.fill;
      ctx.fill();
      if(_.isTreeChopped){
        ctx.beginPath();
        ctx.moveTo(0,-35);
        ctx.curveTo(_.width*0.5-20,-25, _.width*0.5+20,-25, _.width,-35);
        ctx.moveTo(0,-35);
        ctx.curveTo(_.width*0.5-20,-45, _.width*0.5+20,-45, _.width,-35);
        ctx.fillStyle = "rgba(239, 228, 201,1)";
        ctx.fill();

        // start clipping
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, -35, _.width, 80);
        ctx.clip();
        _.lastTrunkChop.draw();
        ctx.restore();
        // end clipping
      }
      ctx.restore();


      // tree 
      ctx.save();
      ctx.translate(_.x -_.width*0.5, _.y);
      ctx.rotate(_.r*DEG2RAD);
      ctx.beginPath();
      ctx.rect(0,-35, _.width, -_.height - _.trunkHeightOffset);
      ctx.moveTo(0,-35);
      ctx.curveTo(_.width*0.5-20,-25, _.width*0.5+20,-25, _.width,-35);
      ctx.fillStyle = _.fill;
      ctx.fill();

      // tree knots
      len = _.weakSpots.length;
      for (i = 0; i < len; i++) {
        var spot = _.weakSpots[i];
        spot.draw();
      }

      //============ hitTest ============
      ctx.beginPath();
      if (!_.isTreeChopped && AttackDetail && pointInRect(a, {
        x: _.x -_.width*0.5,
        y: _.y - _.height,
        width: _.width,
        height: _.height
      }, a.radius * 0.2)) {
        var insideChop = false;
        var chop = new DisplayObject(new Circle(0, 0, a.radius, "rgba(239, 228, 201,.7)", 0, 180, 1, 1), new Circle(0, 0, a.radius, "rgba(86, 71, 39,.7)", 180, 360, 1, 1));
        chop.ctx = ctx;
        chop.scaleY = 0.15;
        chop.width = a.radius * 2 * chop.scaleY;
        chop.height = chop.width;
        chop.x = a.x+_.width*0.5 - _.x;
        chop.y = a.y - _.y;
        chop.r = getRandInt(-4, 4);

        len = _.chops.length;
        var trunkChops = 0;
        for (i = 0; i < len; i++) {
          if (pointInRect(chop, _.chops[i], 2)) {
            insideChop = _.chops[i];
            break;
          }
          if(_.chops[i].y == _.chopBottomY){
            trunkChops = trunkChops + 1;
          }
          if(_.chops[i].scaleY > 1.2){
            trunkChops = trunkChops + 1;
          }
        }
        if (insideChop) {
          _.chops[i].scaleX = _.chops[i].scaleX + 0.02;
          _.chops[i].scaleY = _.chops[i].scaleY + 0.02;
          if(_.chops[i].scaleY>0.65 && _.chops[i].y == _.chopBottomY && _.bigTrunkChop!==null){
            _.bigTrunkChop = true;
            _.lastTrunkChop = _.chops[i];
            _.isTreeChopped = true;
            delay(function(){
              $("end-panel").className = "";
              delay(function(){
                $("end-panel").className = "show";
              },10);
              var numNests =  _.numBirdNestsFound;
              $("numNests").innerHTML = numNests;
              $("nestScore").innerHTML = commaNum(parseInt(numNests*500));
              $("hScore").innerHTML = commaNum(parseInt(terry.highestTraveled));
              $("end-score").innerHTML = commaNum(parseInt(scoreBoard.score));
              
            },3000);
          }
        } else {
          _.chops.push(chop);
        }
        // update woodchips
        len = 10;
        var curChopChips = _.loadChips(len);
        for (i = 0; i < len; i++) {
          chip = curChopChips[i];
          if (!chip) {
            continue;
          }
          chip.x = a.x;
          chip.y = a.y;
          chip.randomVelocity();
        }
      }

      // start clipping
      ctx.save();
      ctx.beginPath();
      if(_.isTreeChopped){
        ctx.rect(0, _.y - _.height, _.width, _.height-_.y-34);
        ctx.moveTo(0,-34);
        ctx.curveTo(_.width*0.5-20,-25, _.width*0.5+20,-25, _.width,-34);
      }else{
        ctx.rect(0, _.y - _.height, _.width, _.height-_.y);
      }
      ctx.clip();
      len = _.chops.length;
      for (i = 0; i < len; i++) {
        _.chops[i].draw();
      }
      ctx.restore();
      // end clipping
      //============ end hitTest ============
      ctx.restore(); // tree

      var viewBotom = viewY-H;
      var foundBranchToHover = false;
      if(!_.isTreeChopped){
        // tree branches
        len = _.branches.length;
        for (i = 0; i < len; i++) {
          var branch = _.branches[i];
          if(branch && _.branches[i].y<_.bear.y){
            branch.draw();
            if(!foundBranchToHover){
              if(branch.birdNest && dist(branch,bird)<300 && dist(terry,branch)<200 && i%2==0){
                bird.follow = branch;
                foundBranchToHover = true;
              }else{
                bird.follow = terry;
              }
            }
          }else{
            _.branches[i] = null;
            // _.branches.splice(i,1);
          }
        }
        // canopy
        _.canopy.draw();
      }

      
      if(_.bigTrunkChop){
        ctxTweener.add(_, {prop:'r', start:0, end:-90}, curTime, 2500, Math.easeInCubic);
        _.bigTrunkChop = null;
      }

      // ==================== PARTICLE EFFECT ====================
      // draw chips
      len = _.activeChipPool.length;
      ctx.beginPath();
      ctx.fillStyle = "#eddcb4";
      for (i = 0; i < len; i++) {
        chip = _.activeChipPool[i];
        if (!chip) {
          continue;
        }
        chip.update();

        //============ out of bounds ============
        if (chip.hasHitGround()) {
          _.floorChips.drawChip(chip);
          _.chipPool.push(chip);
          _.activeChipPool.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(chip.x - chip.w * 0.5, chip.y - chip.h * 0.5);
        ctx.rotate(chip.r * DEG2RAD);
        ctx.rect(-chip.w * 0.5, - chip.h * 0.5, chip.w, chip.h);
        ctx.restore();
      }
      ctx.fill();
      // ==================== END PARTICLE EFFECT ====================
      AttackDetail = null;
      _.bear.draw()
    }

  };

  function ClimbableBranch(options) {
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }
    _.fill = _.ctx.createLinearGradient(0, 0, 0, 8);
    _.fill.addColorStop(0, "#826D3F");
    _.fill.addColorStop(1, "#564629");

    _.bushFill = _.ctx.createLinearGradient(0, 0, 0, 50);
    _.bushFill.addColorStop(0, "rgba(68, 74, 35,.99)");
    _.bushFill.addColorStop(1, "rgba(48, 54, 15,1)");

    _.bushScaleY = getRand(0.4, 1);
    if (_.width > 130) {
      _.hasBush = true;
    }
  }
  ClimbableBranch.prototype = {
    ctx: null,
    x: 10,
    y: 14,
    width: 100,
    height: 8,
    r: 0,
    scaleX: 1,
    scaleY: 1,
    fill: null,
    bushFill: "rgba(68, 74, 35,1)",
    bushScaleX: 0.5,
    bushScaleY: 0.5,
    onLeft: true,
    hasBush: false,
    hasBirdNest: true,
    birdNest: null,
    addBirdNest: function () {
      var _ = this;
      var x = _.onLeft ? _.x : _.x + _.width;
      _.birdNest = new BirdNest({
        x: x,
        y: _.y
      });
      _.shakeStartTime = curTime;
      _.shakeTime = curTime - _.shakeStartTime;
      _.hasBirdNest = true;
      _.initialBushScaleX = _.bushScaleX;

      _.shakeIntervalDuration = getRandInt(5000,12000);
      _.shakeIntervalTime = curTime + _.shakeIntervalDuration;
      _.shakeDuration = 1000;
      _.shakeDurationEnd = curTime + _.shakeDuration;
    },
    draw: function () {
      var _ = this;
      var ctx = _.ctx;
      // var branch = new Rect(_.x,_.y,_.width,_.height, 0, _.fill);
      var branch = new CustomShape(function () {
        ctx.beginPath();
        ctx.save();
        if (_.onLeft) {
          ctx.translate(_.x, _.y);
          ctx.lineTo(_.width, 0);
          ctx.lineTo(_.width, _.height);
          ctx.lineTo(0, _.height * 0.4);
          ctx.lineTo(0, 0);
        } else {
          ctx.translate(_.x, _.y);
          ctx.lineTo(_.width, 0);
          ctx.lineTo(_.width, _.height * 0.4);
          ctx.lineTo(0, _.height);
          ctx.lineTo(0, 0);
        }
        ctx.fillStyle = _.fill;
        ctx.fill();

        if(curTime > _.shakeIntervalTime){
          _.shakeStartTime = curTime;
          _.shakeIntervalTime = curTime + _.shakeIntervalDuration;
          _.shakeDurationEnd = curTime + _.shakeDuration;
        }

        if(_.birdNest && curTime < _.shakeDurationEnd){
          var dur = 100;
          _.shakeTime = curTime - _.shakeStartTime;
          if (!_.shakeInEnd) {
            _.bushScaleX = tween(_.shakeTime, _.initialBushScaleX, _.initialBushScaleX - 0.02, dur, Math.easeOutCubic);
          }else{
            _.bushScaleX= tween(_.shakeTime, _.initialBushScaleX - 0.02, _.initialBushScaleX, dur, Math.easeOutCubic);
          }

          if(_.bushScaleX>2){
            _.bushScaleX = _.initialBushScaleX;
          }

          if (_.shakeTime > dur && !_.shakeInEnd) {
            _.shakeTime = 0;
            _.shakeInEnd = true;
          }
          if (_.shakeTime > dur && _.shakeInEnd) {
            _.shakeStartTime = curTime;
            _.shakeTime = 0;
            _.shakeInEnd = false;
          }
        }


        // pine bush
        if (_.width > 130) {
          ctx.save();
          ctx.scale(_.onLeft ? 1 : -1, 1);
          ctx.translate(_.onLeft ? 0 : -_.width, 0);
          ctx.beginPath();
          var x = 90;
          var sx = (_.width / 250) * 0.8 * _.bushScaleX;
          var sy = _.bushScaleY;

          ctx.moveTo(x, 0);
          ctx.curveTo((x - 130) * sx, - 50 * sy, (x - 170) * sx, - 30 * sy, (x - 120) * sx, - 10 * sy);
          ctx.curveTo((x - 230) * sx, 0 * sy, (x - 260) * sx, 40 * sy, (x - 220) * sx, 40 * sy);
          ctx.curveTo((x - 290) * sx, 84 * sy, (x - 160) * sx, 84 * sy, (x - 150) * sx, 54 * sy);
          ctx.curveTo((x - 160) * sx, 34 * sy, (x + 20) * sx, 124 * sy, (x - 90) * sx, 14 * sy);
          ctx.curveTo((x - 60) * sx, 95 * sy, (x + 20) * sx, 85 * sy, (x + 10) * sx, 25 * sy);
          ctx.curveTo((x + 30) * sx, 15 * sy, (x + 50) * sx, 65 * sy, x, 0);
          ctx.fillStyle = _.bushFill;
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      });
      branch.draw();

      if (_.hasBirdNest && _.birdNest) {
        _.birdNest.draw();
      }
    }
  };

  function BirdNest(options) {
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }
    _.fill = _.ctx.createLinearGradient(0, 0, 0, 8);
    _.fill.addColorStop(0, "#8F7442");
    _.fill.addColorStop(1, "#7F6331");

    _.eggFill = _.ctx.createLinearGradient(0, 0, 0, 5);
    _.eggFill.addColorStop(0, "rgb(255,255,255)");
    _.eggFill.addColorStop(1, "rgb(140,140,140)");
  }
  BirdNest.prototype = {
    ctx: null,
    x: 0,
    y: 0,
    r: 0,
    opacity: 1,
    fill: "#7F6331",
    eggFill: "#FFF",
    hidden: true,
    isFound: false,
    image: null,
    revealAndRemoveFrom: function (branch, offsetX) {
      // if(_.isFound) { return; }
      var _ = this;
      _.revealStartTime = curTime;
      _.initialY = _.y;
      _.x = branch.onLeft? offsetX-44 : offsetX;
      _.hidden = false;
      _.isFound = true;
      _.isRevealing = true;
      _.branch = branch;
    },
    draw: function () {
      var _ = this;
      if (_.hidden) {
        return;
      }

      if (_.isRevealing) {
        var dur = 400;
        var fadeDur = 1200;
        _.revealTime = curTime - _.revealStartTime;
        if (!_.revealEnd) {
          _.y = tween(_.revealTime, _.initialY-10, _.initialY - 20, dur, Math.easeOutCubic);
        }
        if (_.fadeStart) {
          _.opacity = tween(_.revealTime, 4, 0, fadeDur, Math.easeInCubic);
        }

        if (_.revealTime > dur && !_.revealEnd) {
          _.y = _.initialY - 20;
          _.revealStartTime = curTime;
          _.revealTime = 0;
          // _.hidden = true;
          _.revealEnd = true;
          _.fadeStart = true;
        }

        if (_.revealTime > fadeDur && _.fadeStart) {
          _.draw = function () {};
          _.branch.birdNest = null;
          delete _.branch.birdNest;
          return;
        }
      }


      var ctx = _.ctx;
      // outer nest
      ctx.save();
      ctx.globalAlpha = _.opacity;

      if (_.image) {
        ctx.save();
        ctx.translate(_.x, _.y);
        ctx.drawImage(_.image, 0, 0, 44, 30, 0, 0, 44, 30);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(_.x, _.y);
        ctx.scale(1, 0.6);
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, TWO_PI);
        ctx.fillStyle = _.fill;
        ctx.fill();
        ctx.restore();


        // inner shadow
        ctx.save();
        ctx.translate(_.x, _.y - 4);
        ctx.scale(0.9, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, TWO_PI);
        ctx.fillStyle = "rgba(0,0,0,.3)";
        ctx.fill();
        ctx.restore();

        // eggs
        ctx.save(); // clipping
        ctx.save();
        ctx.translate(_.x, _.y - 4);
        ctx.scale(0.9, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, TWO_PI);
        ctx.arc(0, - 8, 15, 0, TWO_PI);
        ctx.arc(0, - 18, 20, 0, TWO_PI);
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fill();
        ctx.restore();
        ctx.clip();

        ctx.save();
        ctx.translate(_.x, _.y - 4);
        ctx.scale(0.6, 1);
        ctx.beginPath();
        ctx.arc(-13, 0, 7, 0, TWO_PI);
        ctx.arc(12, - 2, 7, 0, TWO_PI);
        ctx.fillStyle = _.eggFill;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(_.x, _.y - 4);
        ctx.scale(0.6, 1);
        ctx.beginPath();
        ctx.arc(0, - 2, 10, 0, TWO_PI);
        ctx.shadowColor = "rgba(0,0,0,.3)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = _.eggFill;
        ctx.fill();
        ctx.restore();

        ctx.restore(); // clipping
      }

      ctx.restore(); // opacity
    }
  };

  function Canopy(options) {
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }

    _.fill = _.ctx.createLinearGradient(0, 0, 0, 50);
    _.fill.addColorStop(0, "rgba(68, 74, 35,1)");
    _.fill.addColorStop(1, "rgba(48, 54, 15,1)");
  }
  Canopy.prototype = {
    ctx: null,
    x: 0,
    y: 0,
    r: 0,
    scaleX: 5,
    scaleY: 5,
    fill: "rgba(68, 74, 35,.98)",
    draw: function () {
      var _ = this;
      var ctx = _.ctx;
      ctx.save();
      ctx.scale(1, 1);
      ctx.translate(_.x, _.y);
      var x = 200;
      var y = -40;
      var sx = 3;
      var sy = 5;
      for (var i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.curveTo((x - 130) * sx, (-50 + y) * sy, (x - 170) * sx, (-60 + y) * sy, (x - 120) * sx, (-10 + y) * sy);
        ctx.curveTo((x - 230) * sx, (0 + y) * sy, (x - 260) * sx, (40 + y) * sy, (x - 220) * sx, (40 + y) * sy);
        ctx.curveTo((x - 290) * sx, (84 + y) * sy, (x - 160) * sx, (84 + y) * sy, (x - 150) * sx, (54 + y) * sy);
        ctx.curveTo((x - 160) * sx, (34 + y) * sy, (x + 20) * sx, (124 + y) * sy, (x - 90) * sx, (14 + y) * sy);
        ctx.curveTo((x - 60) * sx, (95 + y) * sy, (x + 20) * sx, (85 + y) * sy, (x + 10) * sx, (25 + y) * sy);
        ctx.curveTo((x + 30) * sx, (15 + y) * sy, (x + 50) * sx, (15 + y) * sy, x, 0);
        x = x + 100;
        ctx.fillStyle = _.fill;
        ctx.fill();
      }
      ctx.restore();
    }
  };

  function TreeKnot(options) {
    this.ctx = ctx;
    for (var attrname in options) {
      this[attrname] = options[attrname];
    }
    this.r = getRandInt(0, 360);
    this.isKnot = random() < 0.2;
  }
  TreeKnot.prototype = {
    ctx: null,
    x: 10,
    y: 14,
    size: 0.5,
    r: 0,
    scaleX: 1,
    scaleY: 1,
    isKnot: false,
    draw: function () {
      var _ = this;
      var ctx = _.ctx;
      var knot = new DisplayObject(new CustomShape(function () {
        if (_.isKnot) {
          var a = 1; // inner size
          var b = _.size; // outer size 1-3
          var centerx = 0;
          var centery = 0;
          ctx.save();
          ctx.beginPath();
          ctx.translate(_.x, _.y);
          ctx.rotate(_.r * DEG2RAD);
          for (var i = 0; i < 80; i++) {
            var angle = 0.1 * i;
            var x = centerx + (a + b * angle) * Math.cos(angle);
            var y = centery + (a + b * angle) * Math.sin(angle);
            ctx.lineTo(x, y);
          }
          ctx.strokeStyle = "rgba(178, 160, 123,.4)";
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.translate(_.x, _.y);
          ctx.moveTo(0, 0);
          ctx.lineTo(0, 10);
          ctx.lineTo(3, 10);
          ctx.moveTo(3, 3);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(68, 57, 33,.2)";
          ctx.stroke();
          ctx.restore();
        }
      }));
      knot.draw();
    }
  };

  function WoodChipParticle(options) {
    for (var attrname in options) {
      this[attrname] = options[attrname];
    }
  }
  WoodChipParticle.prototype = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    vr: 0,
    r: 0,
    w: 6,
    h: 2,
    gravityY: 4,
    color: "#eddcb4",
    hitLimit: 3,
    curHits: 0,
    isAttached: true,
    groundY: 370,
    randomVelocity: function () {
      var _ = this;
      _.vy = getRand(-5, 5);
      _.vx = getRand(-3, 3);
      _.vr = getRand(-8, 8);
    },
    update: function () {
      var _ = this;
      var d = (curTime - lastTime) * 0.002;
      _.vy = _.vy + _.gravityY * d;
      _.x = _.x + _.vx;
      _.y = _.y + _.vy;
      _.r = _.r + _.vr;
    },
    isOutofBounds: function () {
      return this.x < 0 || this.x > W || this.y < 0 || this.y > this.groundY;
    },
    hasHitGround: function () {
      return this.y > this.groundY;
    }
  };

  function FloorChips(options) {
    this.ctx = ctx;
    for (var attrname in options) {
      this[attrname] = options[attrname];
    }
  }
  FloorChips.prototype = {
    ctx: null,
    drawChip: function (chip) {
      this.count = this.count + 1;
      var ctx = this.ctx;
      ctx.fillStyle = Math.random() > 0.5 ? "#d3c198" : "#eddcb4";
      ctx.save();
      ctx.beginPath();
      ctx.translate(chip.x - chip.w * 0.5, chip.y - chip.h * 0.5 + getRand(-5, 5));
      ctx.rotate(chip.r * DEG2RAD);
      ctx.rect(-chip.w * 0.5, - chip.h * 0.5, chip.w, chip.h);
      ctx.fill();
      ctx.restore();
    }
  };

  function Forest(options) {
    this.ctx = ctx;
    for (var attrname in options) {
      this[attrname] = options[attrname];
    }
    this.init();
  }
  Forest.prototype = {
    ctx: null,
    x: 10,
    y: 14,
    width: 400,
    height: 50,
    r: 0,
    scaleX: 1,
    scaleY: 1,
    numTrees: 400,
    trees: [],
    image: null,
    colorLuminanceOffset: 0,
    treeScaleX: 0.5,
    treeScaleY: 0.5,
    init: function () {
      var _ = this;
      var i;
      _.trees = [];
      for (i = 0; i < _.numTrees; i++) {
        var pineTree = new PineTree({
          random: true,
          y: _.y,
          colorLuminanceOffset: _.colorLuminanceOffset,
          scaleX: _.treeScaleX,
          scaleY: _.treeScaleY
        });
        pineTree.ctx = _.ctx;
        _.trees.push(pineTree);
      }
    },
    getAsImage: getAsImage,
    draw: function () {
      var i, _ = this;
      for (i = 0; i < _.numTrees; i++) {
        var pineTree = _.trees[i];
        pineTree.draw();
      }
    }
  };

  function PineTree(options) {
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }
    if (_.random) {
      _.scaleX = getRand(_.scaleX - 0.2, _.scaleX + 0.2);
      _.scaleY = _.scaleX;
      _.x = getRandInt(0, W);
    }
  }
  PineTree.prototype = {
    ctx: null,
    x: 100,
    y: 0,
    groundY: 350,
    scaleX: 0.3,
    scaleY: 0.3,
    random: false,
    colorLuminanceOffset: 0,
    draw: function () {
      var _ = this;
      var ctx = _.ctx;
      ctx.save();

      var treeSeg = new DisplayObject(new CustomShape(function () {
        ctx.moveTo(0, 0);
        ctx.curveTo(10, 25, 10, 55, 50, 50);
        ctx.curveTo(25, 60, 25, 60, 0, 55);
        ctx.curveTo(-25, 60, - 25, 60, - 50, 50);
        ctx.curveTo(-10, 55, - 10, 25, 0, 0);
      }));
      treeSeg.x = _.x * (1 / _.scaleX);
      treeSeg.y = (_.groundY + _.y) * (1 / _.scaleY);

      ctx.save();
      ctx.scale(_.scaleX, _.scaleY);
      ctx.translate(0, - 280);

      // trunk
      ctx.beginPath();
      ctx.rect(treeSeg.x - 5, treeSeg.y + 80, 10, 300);
      ctx.fillStyle = "#7A663B";
      ctx.fill();

      ctx.beginPath();
      treeSeg.ctx = ctx;
      // seg 1
      treeSeg.scaleX = 0.5;
      treeSeg.draw();
      // seg 2
      treeSeg.y = treeSeg.y + 20;
      treeSeg.scaleX = 0.6;
      treeSeg.draw();
      // seg 3
      treeSeg.y = treeSeg.y + 20;
      treeSeg.scaleX = 0.8;
      treeSeg.scaleY = 1.2;
      treeSeg.draw();
      // seg 4
      treeSeg.y = treeSeg.y + 20;
      treeSeg.scaleX = 1;
      treeSeg.scaleY = 1.5;
      treeSeg.draw();

      ctx.shadowColor = "rgba(0,0,0,.06)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = Math.random() > 0.5 ? colorLuminance("#7b8740", 0 + _.colorLuminanceOffset) : colorLuminance("#7b8740", - 0.05 + _.colorLuminanceOffset);
      ctx.fill();

      ctx.restore();
    }
  };
  function Bird(options){
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }
    _.birdFill = ctx.createLinearGradient(0, 0, 0, 20);
    _.birdFill.addColorStop(0, "#CFD0F2");
    _.birdFill.addColorStop(1, "#9292DE");
    _.backwingFill = colorLuminance("#9292DE",-0.1);
    _.yHover = 0;
    _.flyInterval = curTime;
    _.wingsUp = false;
  }
  Bird.prototype = {
    ctx: null,
    x: 0,
    y: 0,
    r: 0,
    vx: 0,
    vy: 0,
    follow: null,
    scaleX: 0.5,
    scaleY: 0.5,
    update: function(){
      var _ = this;
      // _.x = _.follow.x + 30;
      // _.y = _.follow.y - 20;

      var dx = _.follow.x;
      if(_.follow.onLeft==false){
        dx = dx + _.follow.width;
      }
      var dy = _.follow.y;

      _.x = _.x + (dx + 30 - _.x) * 0.02;
      _.y = _.y + (dy - 20 - _.y) * 0.02;

      _.yHover = _.yHover + 0.03;
      _.y = _.y + 1*Math.sin(_.yHover);
      _.x = _.x + 1*Math.sin(_.yHover+PI*0.25);

      if(_.follow.x<_.x && _.scaleX>0){
        _.scaleX = abs(_.scaleX) * -1;
      }else if(_.follow.x>_.x && _.scaleX<0){
        _.scaleX = abs(_.scaleX);
      }

      var dY = (_.follow.y-20) - _.y;
      if(abs(dY)>10 && abs(dY)<60 ){
        _.r = dY*0.4;
      }

    },
    draw: function(){
      var _ = this;
      _.update();
      var ctx = _.ctx;

      var elapsed = curTime - _.flyInterval;
      if(elapsed>60){
        _.wingsUp = !_.wingsUp;
        _.flyInterval = curTime;
      }

      ctx.save();
      ctx.translate(_.x,_.y);
      ctx.scale(_.scaleX,_.scaleY);
      ctx.rotate(_.r*DEG2RAD);

      // legs
      ctx.beginPath();
      ctx.moveTo(0,8);
      ctx.lineTo(-23,25);

      ctx.moveTo(-4,8);
      ctx.lineTo(-30,21);
      ctx.lineWidth = 2.3;
      ctx.strokeStyle = "#A52307";
      ctx.stroke();

      // upper beak
      ctx.moveTo(15,-9);
      ctx.lineTo(33,-2);
      ctx.lineTo(8,4);
      ctx.fillStyle = "#FF6600";
      ctx.fill();

      // lower beak
      ctx.beginPath();
      ctx.moveTo(8,4);
      ctx.lineTo(30,-2);
      ctx.lineTo(8,12);
      ctx.fillStyle = "#C74519";
      ctx.fill();
      ctx.closePath();

      // back wing
      ctx.save();
      ctx.beginPath();
      if(_.wingsUp){
        ctx.rotate(30*DEG2RAD);
      }else{
        ctx.rotate(0*DEG2RAD);
      }
      ctx.beginPath();
      ctx.scale(1,0.2);
      ctx.translate(-15,-5);
      ctx.arc(0,0,20,0,TWO_PI);
      ctx.fillStyle = _.backwingFill;
      ctx.fill();
      ctx.restore();

      //body
      ctx.beginPath();
      ctx.arc(0,0,20,0,TWO_PI);
      ctx.fillStyle = _.birdFill;
      ctx.fill();

      // front wing
      ctx.save();
      ctx.beginPath();
      if(_.wingsUp){
        ctx.rotate(15*DEG2RAD);
      }else{
        ctx.rotate(-15*DEG2RAD);
      }
      ctx.beginPath();
      ctx.scale(1,0.25);
      ctx.translate(-20,6);
      ctx.arc(0,0,20,0,TWO_PI);
      ctx.fillStyle = _.birdFill;
      ctx.fill();
      ctx.restore();

      //eye
      ctx.beginPath();
      ctx.arc(12,-4,3.8,0,TWO_PI);
      ctx.fillStyle = "#000";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(13,-3,1.7,0,TWO_PI);
      ctx.fillStyle = "#FFF";
      ctx.fill();
      ctx.restore();
    }
  };
  function Bear(options){
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }
    _.bearFill = ctx.createLinearGradient(0, 0, 0, 200);
    _.bearFill.addColorStop(0, "#333");
    _.bearFill.addColorStop(1, "#111");
    _.tailFill = ctx.createLinearGradient(0, 0, 0, 25);
    _.tailFill.addColorStop(0, "#222");
    _.tailFill.addColorStop(1, "#333");
    _.backwingFill = colorLuminance("#000",-0.1);
    _.yHover = 0;
    _.climbInterval = curTime;
    _.armY = 0;
    _.bearUp = true;
    _.startTime = curTime;
    _.dur = 1000;
  }
  Bear.prototype = {
    ctx: null,
    x: 0,
    y: 300,
    r: 0,
    vx: 0,
    vy: 2.0,
    follow: null,
    scaleX: 1,
    scaleY: 1,
    armInterval: 1000,
    legY: 215,
    lastLegY: 215,
    start: function(){
      var _ = this;
      _.y = 250;
      _.hasStarted = true;
    },
    update: function(){
      var _ = this;
      var runTime = curTime - _.startTime;
      if(_.bearUp){
        _.armY = tween(runTime, 0, -40, _.dur, Math.easeOutCubic);
        _.legY = tween(runTime, 215, 240, _.dur, Math.easeInOutCubic);
        if(_.hasStarted){
          _.y = tween(runTime, _.y, _.y-_.vy, _.dur, Math.easeOutCubic);
        }
        _.lastLegY = _.legY;
      }else{
        _.armY = tween(runTime, -40, 0, _.dur, Math.easeInOutCubic);
        _.legY = tween(runTime, 240, 215, _.dur, Math.easeOutCubic);
      }
      if(runTime > _.dur){
        _.bearUp =  !_.bearUp;
        _.startTime = curTime;
      }
    },
    draw: function(){
      var _ = this;
      _.update();
      if(!_.hasStarted){ return; }
      var ctx = _.ctx;
      ctx.save();
      ctx.translate(_.x,_.y);
      ctx.scale(_.scaleX,_.scaleY);
      ctx.rotate(_.r*DEG2RAD);
      //arms
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-40,55);
      ctx.curveTo(-70,35,  -70,25,  -50,_.armY);
      ctx.moveTo(40,55);
      ctx.curveTo(70,35,  70,25,  50,_.armY);
      ctx.lineWidth = 40;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#222";
      ctx.stroke();
      ctx.restore();

      //legs
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-30,155);
      ctx.curveTo(-40,185,   -40,185,  -30,_.legY);
      ctx.moveTo(30,155);
      ctx.curveTo(40,185,   40,185,  30,_.legY);
      ctx.lineWidth = 40;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#222";
      ctx.stroke();
      ctx.restore();


      //nose
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0,-45);
      ctx.lineTo(11,-38);
      ctx.lineTo(-11,-38);
      ctx.fillStyle = "#412C1C";
      ctx.fill();
      ctx.restore();

      //snout
      ctx.save();
      ctx.scale(1,0.7);
      ctx.beginPath();
      ctx.arc(0,-40,19,0,TWO_PI);
      ctx.fillStyle = "#A88E62";
      ctx.fill();
      ctx.restore();

      //body
      ctx.beginPath();
      ctx.arc(0,0,37,0,TWO_PI);
      ctx.arc(0,140,66,0,TWO_PI);
      ctx.moveTo(-37,0);
      ctx.lineTo(37,0);
      ctx.lineTo(66,135);
      ctx.lineTo(-66,135);
      ctx.fillStyle = _.bearFill;
      ctx.fill();

      //tail
      ctx.save();
      ctx.translate(0,200);
      ctx.beginPath();
      ctx.arc(-10,0,12,0,TWO_PI);
      ctx.fillStyle = _.tailFill;
      ctx.fill();
      ctx.restore();

      //ears
      ctx.beginPath();
      ctx.arc(-30,-18,11,0,TWO_PI);
      ctx.arc(30,-18,11,0,TWO_PI);
      ctx.fillStyle = "#333";
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    }
  };
  function SpeechBubble(options){
    var _ = this;
    _.ctx = ctx;
    for (var attrname in options) {
      _[attrname] = options[attrname];
    }
    _.textY = 0;
    if(_.msg1){ 
      _.textY = _.height*0.5; 
    }
    if(_.msg2){ 
      _.textY = _.height*0.5-10; 
    }
    if(_.msg3){ 
      _.textY = _.height*0.5-20; 
    }
  }
  SpeechBubble.prototype = {
    ctx: null,
    x: 0,
    y: 0,
    textY: 0,
    msg1: null,
    msg2: null,
    msg3: null,
    width: 200,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    draw: function () {
      var _ = this;
      var ctx = _.ctx;
      if(_.image){
        var x = _.x-20;
        var y = _.y-_.height-20;
        ctx.save();
        ctx.globalAlpha = _.opacity;
        ctx.drawImage(_.image, 0, 0, _.width, _.height, x, y, _.width, _.height);
        x += 40;
        y += _.height-2;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x+20,y);
        ctx.lineTo(x-5,y+20);
        ctx.lineTo(x,y);
        ctx.fillStyle = "#FFF";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }else{
        ctx.roundRect(0,0,_.width,_.height,10);
        ctx.fillStyle = "#FFF";
        ctx.fill();

        ctx.fillStyle = "#333";
        ctx.textBaseline = "middle";
        ctx.font = "13pt Comic Sans MS";
        ctx.textAlign = "center";
        if(_.msg1){
          ctx.fillText(_.msg1, _.width*0.5, _.textY);
        }
        if(_.msg2){
          ctx.fillText(_.msg2, _.width*0.5, _.textY+20);
        }
        if(_.msg3){
          ctx.fillText(_.msg3, _.width*0.5, _.textY+40);
        }
      }
    }
  };
  function ScoreBoard(options) {
    this.ctx = ctx;
    for (var attrname in options) {
      this[attrname] = options[attrname];
    }
  }
  ScoreBoard.prototype = {
    ctx: null,
    score: 0,
    x: 10,
    y: 14,
    width: 400,
    height: 50,
    r: 0,
    scaleX: 0.5,
    scaleY: 0.5,
    counter: null,
    scoreInterval: 0,
    updateScore: function (score) {
      this.score = score;
      this.draw();
    },
    addToScore: function (num) {
      this.score = this.score + num;
      this.updateScore(this.score);
    },
    draw: function () {
      var ctx = this.ctx;
      var len;
      var nums = [];
      var sNumber = this.score.toString();

      len = sNumber.length;
      for (var i = 0; i < len; i += 1) {
        nums.push(+sNumber.charAt(i));
      }

      ctx.clearRect(0, 0, this.width, this.height);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.r * DEG2RAD);
      ctx.scale(this.scaleX, this.scaleY);
      ctx.fillStyle = "#FFF";

      var num, numOffset, numCommas, commaOffset;
      numCommas = (len / 3) << 0;

      commaOffset = len % 3;
      numOffset = len % 3;
      len = nums.length;
      if (len) {
        for (i = 0; i < len; i++) {
          num = nums[i];
          if ((i === commaOffset || i % 3 === commaOffset) && i !== 0) {
            var cg = new NumberGraphic({
              ctx: this.ctx,
              num: 'comma'
            });
            cg.x = i * 35 + numOffset - 12;
            numOffset = numOffset + 15;
            cg.draw();
          }
          var ng = new NumberGraphic({
            ctx: this.ctx,
            num: num
          });
          ng.x = i * 35 + numOffset;
          ng.draw();
        }
      }
      ctx.fill();
      ctx.restore();
    }
  };

  function NumberGraphic(options) {
    this.ctx = ctx;
    for (var attrname in options) {
      this[attrname] = options[attrname];
    }
  }
  NumberGraphic.prototype = {
    ctx: null,
    num: 1,
    x: 0,
    y: 0,
    r: 0,
    scaleX: 0.5,
    scaleY: 0.5,
    draw: function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.scaleX, this.scaleY);

      if (this.num === 9) {
        this.num = 6;
        this.r = this.r + 180;
      }
      if (this.num !== "comma") {
        this.num = "n" + this.num;
      }
      ctx.rotate(this.r * DEG2RAD);
      ctx.beginPath();
      ctx.fillStyle = "#FFF";
      var num = numGraphics[this.num];
      var len = num.length;
      if (len) {
        for (var i = 0; i < len; i++) {
          ctx.lineTo(num[i][0], num[i][1]);
        }
      }
      ctx.fill();
      ctx.restore();
    }
  };

  // UTILS

  function Circle(_x, _y, radius, fill, angleStart, angleStop, scaleX, scaleY) {
    this.x = _x;
    this.y = _y;
    this.z = 0;
    this.radius = radius;
    this.fill = fill;
    this.angleStart = angleStart ? angleStart * DEG2RAD : 0;
    this.angleStop = angleStop ? angleStop * DEG2RAD : TWO_PI;
    this.scaleX = scaleX ? scaleX : 1;
    this.scaleY = scaleY ? scaleY : 1;
    this.ctx = ctx;
  }
  Circle.prototype = {
    ctx: null,
    draw: function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.scale(this.scaleX, this.scaleY);
      ctx.arc(this.x, this.y, this.radius, this.angleStart, this.angleStop, false);
      ctx.fillStyle = this.fill;
      ctx.fill();
      ctx.restore();
    }
  };

  function Rect(_x, _y, w, h, r, fill) {
    this.x = _x;
    this.y = _y;
    this.z = 0;
    this.width = w;
    this.height = h;
    this.r = r ? r * DEG2RAD : 0;
    this.fill = fill;
    this.ctx = ctx;
  }
  Rect.prototype = {
    ctx: null,
    draw: function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.r);
      ctx.beginPath();
      ctx.rect(0, 0, this.width, this.height);
      ctx.fillStyle = this.fill;
      ctx.fill();
      ctx.restore();
    }
  };

  function CustomShape(shape) {
    this.ctx = ctx;
    this.shape = shape;
  }
  CustomShape.prototype = {
    ctx: null,
    x: 0,
    y: 0,
    z: 0,
    r: 0,
    scaleX: 1,
    scaleY: 1,
    draw: function () {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.r * DEG2RAD);
      ctx.scale(this.scaleX, this.scaleY);
      this.shape();
      ctx.restore();
    }
  };

  function DisplayObject(shapes) {
    this.shapes = arguments;
    var len = arguments.length;
    if (len) {
      this.shapes = [];
      for (var i = 0; i < len; i++) {
        this.shapes.push(arguments[i]);
      }
      this.shapes.sort();
    }
    this.ctx = ctx;
  }
  DisplayObject.prototype = {
    ctx: null,
    x: 0,
    y: 0,
    z: 0,
    r: 0,
    scaleX: 1,
    scaleY: 1,
    shapes: null,
    draw: function () {
      var ctx = this.ctx;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.r * DEG2RAD);
      ctx.scale(this.scaleX, this.scaleY);

      var len = this.shapes.length;
      if (len) {
        for (var i = 0; i < len; i++) {
          this.shapes[i].ctx = ctx;
          this.shapes[i].draw();
        }
      } else {
        this.shapes.draw();
      }
      ctx.restore();
    },
    autoZ: function () {
      var len = this.shapes.length;
      if (len) {
        for (var i = 0; i < len; i++) {
          this.shapes[i].z = i;
        }
      }
    },
    refreshOrder: function () {
      if (this.shapes.length) {
        this.shapes.sort(function (a, b) {
          return (a.z - b.z);
        });
      }
    }
  };


  //======= NUMBERS ==========
  var numGraphics={n1:[[13,-45],[17,29],[28,29],[28,46],[-23,46],[-23,30],[-8,27],[-12,-17],[-27,-17],[-27,-35],[-9,-45]],n2:[[7,-45],[33,-30],[30,2],[-2,25],[37,25],[37,46],[-28,46],[-28,26],[-13,4],[10,-9],[4,-26],[-14,-18],[-19,-6],[-36,-19],[-20,-38]],n3:[[-31,-32],[-13,-45],[14,-45],[29,-33],[23,-2],[36,19],[21,40],[-6,46],[-30,29],[-13,15],[2,23],[9,17],[9,9],[-8,7],[-10,-9],[5,-12],[7,-24],[-5,-26],[-19,-15]],n4:[[-26,-45],[-4,-45],[-11,-10],[9,-10],[9,-46],[31,-46],[33,44],[8,45],[10,12],[-31,12],[-31,-11]],n5:[[-26,-44],[33,-48],[33,-26],[-7,-26],[-7,-16],[22,-16],[34,3],[28,35],[-3,48],[-33,39],[-25,16],[-6,20],[7,11],[-3,2],[-29,5]],n6:[[6,-45],[31,-37],[-10,2],[-6,24],[5,33],[15,22],[1,17],[-5,23],[-8,3],[15,-4],[34,8],[34,33],[25,46],[-14,46],[-34,18],[-29,-5]],n7:[[31,-44],[31,-23],[2,15],[2,45],[-26,45],[-19,13],[5,-20],[-31,-20],[-31,-44]],n8:[[31,-34],[11,-24],[4,-32],[-10,-30],[-11,-14],[2,-12],[7,5],[-4,5],[-13,18],[-1,29],[11,17],[3,-12],[12,-23],[32,-33],[26,-2],[39,19],[24,41],[-2,46],[-25,41],[-39,19],[-26,-2],[-33,-33],[-19,-45],[17,-45]],comma:[[11,22],[9,44],[-11,58],[-5,39],[-7,22]],n0:[[33,-34],[13,-24],[5,-33],[-9,-31],[-15,19],[13,26],[13,-23],[33,-33],[40,18],[25,39],[-1,44],[-24,39],[-38,18],[-32,-34],[-18,-46],[18,-46]]};



  function colorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#",
      c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }
    return rgb;
  }

  function pointInRect(p, rect, padding) {
    if (!padding) {
      padding = 0;
    }
    ctx.save();
    ctx.translate(rect.x, rect.y);
    ctx.beginPath();
    ctx.rect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,.05)";
    // ctx.fill();
    ctx.restore();

    return (p.x > rect.x - padding && p.x < rect.x + rect.width + padding && p.y > rect.y - padding && p.y < rect.y + rect.height + padding);
  }

  function Tweener(){
    var _ = this;
    _.tweens = [];
  }
  Tweener.prototype = {
    add: function(obj, tweenProps, startTime, dur, easeFunc){
      this.tweens.push({ obj:obj, startTime:startTime, tweenProps:tweenProps, dur:dur, ease:easeFunc });
    },
    update: function(curtime){
      var _ = this;
      var i, tweenObj, obj, runTime, propObj, len = _.tweens.length;
      for(i=0;i<len;i++){
        tweenObj = _.tweens[i];
        if(!tweenObj){ continue; }
        obj = tweenObj.obj;
        runTime = curtime - tweenObj.startTime;
        propObj = tweenObj.tweenProps;
        
        obj[propObj.prop] = tween(runTime, propObj.start, propObj.end, tweenObj.dur, tweenObj.ease);
        if(curtime>tweenObj.startTime+tweenObj.dur){
          _.tweens[i] = null;
        }else if(curtime>tweenObj.startTime){
          obj.draw();
        }
      }
      _.cleanup();
    },
    offset: function(offsetTime){
      var _ = this;
      var i, tweenObj, len = _.tweens.length;
      for(i=0;i<len;i++){
        tweenObj = _.tweens[i];
        if(!tweenObj){ continue; }
        tweenObj.startTime = tweenObj.startTime + offsetTime;
      }
    },
    cleanup: function(){
      var _ = this;
      var len = _.tweens.length;
      for(i=0;i<len;i++){
        if(!_.tweens[i]){
          _.tweens.splice(i,1);
        }
      }
    }
  };
  function tween(time, startVal, endVal, dur, easeFunc) {
    return startVal + ((startVal > endVal ? -1 : 1) * easeFunc(time, 0, abs(startVal - endVal), dur));
  }

  function dist(pt1, pt2) {
    var xs = 0;
    var ys = 0;
    xs = pt2.x - pt1.x;
    xs = xs * xs;
    ys = pt2.y - pt1.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys);
  }

  function getRandInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  function getRand(min, max) {
    return (random() * (max - min) + min);
  }

  function $(id) {
    return document.getElementById(id);
  }

  function delay(func, delaytime) {
    return setTimeout(func, delaytime);
  }

  function createCanvas(w, h) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    return canvas;
  }
  function getAsImage() {
    var _ = this;
    var dataURL = _.ctx.canvas.toDataURL();
    var img = new Image();
    var total = _.ctx.canvas.getAttribute('data-layers-total');
    if (!total) {
      _.ctx.canvas.setAttribute('data-layers-total', 1);
    } else {
      total = parseInt(total) + 1;
      _.ctx.canvas.setAttribute('data-layers-total', total);
    }

    img.onload = function () {
      _.image = img;
      var loaded = _.ctx.canvas.getAttribute('data-layers-loaded');
      if (!loaded) {
        _.ctx.canvas.setAttribute('data-layers-loaded', 1);
      } else {
        loaded = parseInt(loaded) + 1;
        _.ctx.canvas.setAttribute('data-layers-loaded', loaded);
      }
      var final_total = parseInt(_.ctx.canvas.getAttribute('data-layers-total'));
      if (final_total == loaded) {
        var evt = new CustomEvent('layers-loaded');
        document.dispatchEvent(evt);
      }
    };
    img.src = dataURL;
  }
  function commaNum(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function getCanvasAsImage(canvas, imageName) {
    var ctx = canvas.getContext("2d");
    var dataURL = canvas.toDataURL();
    var img = new Image();
    img.onload = function () {
      var evt = new CustomEvent('image-loaded-'+imageName);
      evt.name = imageName;
      evt.image = img;
      document.dispatchEvent(evt);
    };
    img.src = dataURL;
  }
  return {
    init: function () {
      init();
    },
    replay: function(){
      init();
      $('end-panel').className = '';
    },
    toggleGamePause: function(){
      toggleGamePause();
    }
  };
}());
window.onload = game.init;

var PI = Math.PI, TWO_PI = PI * 2, DEG2RAD = PI / 180;
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();
var abs = Math.abs;
var random = Math.random;
var ceil = Math.ceil;
var round = Math.round;
CanvasRenderingContext2D.prototype.curveTo = CanvasRenderingContext2D.prototype.bezierCurveTo;
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}
Math.easeLinear = function (t, b, c, d) {
  return c * t / d + b;
};
Math.easeInCubic = function (t, b, c, d) {
  t /= d;
  return c * t * t * t + b;
};
Math.easeOutCubic = function (t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
};
Math.easeInOutCubic = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t * t + b;
  }
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
};