/** @license BSD
 * DHTML Snowstorm! JavaScript-based snow for web pages
 * Making it snow on the internets since 2003. You're welcome.
 * -----------------------------------------------------------
 * May 2023 edition: Partial ES6, customized for Armor Alley.
 * --- Previously... -----------------------------------------
 * Version 1.44.20131208 (Previous rev: 1.44.20131125)
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License
 * https://schillmania.com/projects/snowstorm/license.txt
 */

function SnowStorm(window, document) {
  // --- common properties ---

  this.autoStart = false;         // Whether the snow should start automatically or not.
  this.excludeMobile = true;      // Snow is likely to be bad news for mobile phones' CPUs (and batteries.) By default, be nice. Enable at your own risk.
  this.flakesMax = 96;            // Limit total amount of snow made (falling + sticking)
  this.flakesMaxActive = 72;      // Limit amount of snow falling at once (less = lower CPU use)
  this.animationInterval = 33;    // Theoretical "miliseconds per frame" measurement. 20 = fast + smooth, but high CPU use. 50 = more conservative, but slower
  this.useGPU = true;             // Enable transform-based hardware acceleration, reduce CPU load.
  this.className = null;          // CSS class name for further customization on snow elements
  this.flakeBottom = null;        // Integer for Y axis snow limit, 0 or null for "full-screen" snow effect
  this.followMouse = true;        // Snow movement can respond to the user's mouse
  this.snowColor = '#fff';        // Don't eat (or use?) yellow snow.
  this.snowCharacter = '&bull;';  // &bull; = bullet, &middot; is square on some systems etc.
  this.snowStick = true;          // Whether or not snow should "stick" at the bottom. When off, will never collect.
  this.targetElement = 'world-wrapper';      // element which snow will be appended to (null = document.body) - can be an element ID eg. 'myDiv', or a DOM node reference
  this.useMeltEffect = true;      // When recycling fallen snow (or rarely, when falling), have it "melt" and fade out if browser supports it
  this.useTwinkleEffect = false;  // Allow snow to randomly "flicker" in and out of view while falling
  this.usePositionFixed = false;  // true = snow does not shift vertically when scrolling. May increase CPU load, disabled by default - if enabled, used only where supported
  this.usePixelPosition = true;   // Whether to use pixel values for snow top/left vs. percentages. Auto-enabled if body is position:relative or targetElement is specified.

  // --- less-used bits ---

  this.freezeOnBlur = true;       // Only snow when the window is in focus (foreground.) Saves CPU.
  this.flakeLeftOffset = 0;       // Left margin/gutter space on edge of container (eg. browser window.) Bump up these values if seeing horizontal scrollbars.
  this.flakeRightOffset = 0;      // Right margin/gutter space on edge of container
  this.flakeWidth = 3;            // Max pixel width reserved for snow element
  this.flakeHeight = 3;           // Max pixel height reserved for snow element
  this.vMaxX = 2;                 // Maximum X velocity for snow
  this.vMinY = 0;                 // Minimum Y velocity for snow 
  this.vMaxY = 2.5;               // Maximum Y velocity for snow
  this.zIndex = 0;                // CSS stacking order applied to each snowflake

  // --- "No user-serviceable parts inside" past this point, yadda yadda ---

  const storm = this;

  let features;

  const // UA sniffing and backCompat rendering mode checks for fixed position, etc.
  isIE = navigator.userAgent.match(/msie/i);

  const isIE6 = navigator.userAgent.match(/msie 6/i);
  const isMobile = navigator.userAgent.match(/mobile|iphone|ipad/i) || navigator?.maxTouchPoints > 0;
  const isBackCompatIE = (isIE && document.compatMode === 'BackCompat');
  const noFixed = (isBackCompatIE || isIE6);
  let screenX = null;
  let screenX2 = null;
  let screenY = null;
  let scrollY = null;
  let docHeight = null;
  let vRndX = null;
  let vRndY = null;
  let windOffset = 1;
  const windMultiplier = 1.5;
  const flakeTypes = 6;
  let fixedForEverything = false;
  let targetElementIsRelative = false;

  const opacitySupported = (() => {
    try {
      document.createElement('div').style.opacity = '0.5';
    } catch(e) {
      return false;
    }
    return true;
  })();

  let didInit = false;
  
  features = (() => {

    let getAnimationFrame;

    /**
     * hat tip: paul irish
     * https://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * https://gist.github.com/838785
     */

    function timeoutShim(callback) {
      window.setTimeout(callback, 1000/(storm.animationInterval || 20));
    }

    const _animationFrame = (window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        timeoutShim);

    // apply to window, avoid "illegal invocation" errors in Chrome
    getAnimationFrame = _animationFrame ? function(...args) {
      return _animationFrame.apply(window, args);
    } : null;

    let testDiv;

    testDiv = document.createElement('div');

    function has(prop) {

      // test for feature support
      const result = testDiv.style[prop];
      return (result !== undefined ? prop : null);

    }

    // note local scope.
    const localFeatures = {

      transform: {
        ie:  has('-ms-transform'),
        moz: has('MozTransform'),
        opera: has('OTransform'),
        webkit: has('webkitTransform'),
        w3: has('transform'),
        prop: null // the normalized property value
      },

      getAnimationFrame

    };

    localFeatures.transform.prop = (
      localFeatures.transform.w3 || 
      localFeatures.transform.moz ||
      localFeatures.transform.webkit ||
      localFeatures.transform.ie ||
      localFeatures.transform.opera
    );

    testDiv = null;

    return localFeatures;

  })();

  this.timer = null;
  this.flakes = [];
  this.disabled = false;
  this.active = false;
  this.meltFrameCount = 20;
  this.meltFrames = [];

  this.setXY = (s) => {

    if (!s) return;

    const newY = (s.y - storm.flakeHeight);

    if (storm.usePixelPosition || targetElementIsRelative) {

      if (storm.useGPU && features.transform.prop) {
        // GPU-accelerated snow.
        s._style.setProperty(features.transform.prop, `translate3d(${s.x - storm.flakeWidth}px, ${newY >= 32 ? (s.y - storm.flakeHeight) : -32}px, 0px) scale3d(${s.scale},${s.scale},1)`);
      } else {
        s._style.setProperty('left', `${s.x - storm.flakeWidth}px`);
        s._style.setProperty('top', `${s.y - storm.flakeHeight}px`);
      }

    } else if (noFixed) {

      s._style.setProperty('right' `${100-(s.x/screenX*100)}%`);
      // avoid creating vertical scrollbars
      s._style.setProperty('top' `${Math.min(s.y, docHeight-storm.flakeHeight)}px`);

    } else {

      if (!storm.flakeBottom) {

        // if not using a fixed bottom coordinate...
        s._style.setProperty('right', `${100-(s.x/screenX*100)}%`);
        s._style.setProperty('bottom', `${100-(s.y/screenY*100)}%`);

      } else {

        // absolute top.
        s._style.setProperty('right', `${100-(s.x/screenX*100)}%`);
        s._style.setProperty('top', `${Math.min(s.y, docHeight-storm.flakeHeight)}px`);

      }

    }

  };

  this.events = (() => {

    const old = (!window.addEventListener && window.attachEvent),
          slice = Array.prototype.slice,
          evt = {
            add: (old?'attachEvent':'addEventListener'),
            remove: (old?'detachEvent':'removeEventListener')
          };

    function getArgs(oArgs) {
      const args = slice.call(oArgs), len = args.length;
      if (old) {
        args[1] = `on${args[1]}`; // prefix
        if (len > 3) {
          args.pop(); // no capture
        }
      } else if (len === 3) {
        args.push(false);
      }
      return args;
    }

    function apply(args, sType) {
      const element = args.shift(), method = [evt[sType]];
      if (old) {
        element[method](args[0], args[1]);
      } else {
        element[method](...args);
      }
    }

    function addEvent(...args) {
      apply(getArgs(args), 'add');
    }

    function removeEvent(...args) {
      apply(getArgs(args), 'remove');
    }

    return {
      add: addEvent,
      remove: removeEvent
    };

  })();

  function rnd(n,min) {
    if (isNaN(min)) {
      min = 0;
    }
    return (Math.random()*n)+min;
  }

  function plusMinus(n) {
    return (parseInt(rnd(2),10)===1?n*-1:n);
  }

  this.randomizeWind = function(andApply = true, yAxisOnly = false) {
    
    let i;
    if (!yAxisOnly) vRndX = plusMinus(rnd(storm.vMaxX,0.2));
    vRndY = storm.vMinY + rnd(storm.vMaxY,0.2);
    if (andApply && this.flakes) {
      for (i=0; i<this.flakes.length; i++) {
        if (this.flakes[i].active) {
          this.flakes[i].setVelocities();
        }
      }
    }
  };

  this.scrollHandler = () => {
    let i;
    // "attach" snowflakes to bottom of window if no absolute bottom value was given
    scrollY = (storm.flakeBottom ? 0 : parseInt(window.scrollY || document.documentElement.scrollTop || (noFixed ? document.body.scrollTop : 0), 10));
    if (isNaN(scrollY)) {
      scrollY = 0; // Netscape 6 scroll fix
    }
    if (!fixedForEverything && !storm.flakeBottom && storm.flakes) {
      for (i=0; i<storm.flakes.length; i++) {
        if (storm.flakes[i].active === 0) {
          storm.flakes[i].stick();
        }
      }
    }
  };

  this.resizeHandler = () => {
    const innerWidth = parseInt(window.innerWidth, 10);
    const innerHeight = parseInt(window.innerHeight, 10);
    if (innerWidth || innerHeight) {
      screenX = innerWidth - 16 - storm.flakeRightOffset;
      screenY = (storm.flakeBottom || innerHeight);
    } else {
      screenX = (document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth) - (!isIE ? 8 : 0) - storm.flakeRightOffset;
      screenY = storm.flakeBottom || document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
    }
    docHeight = document.body.offsetHeight;
    screenX2 = parseInt(screenX/2, 10);
  };

  this.resizeHandlerAlt = () => {
    screenX = storm.targetElement.offsetWidth - storm.flakeRightOffset;
    screenY = storm.flakeBottom || storm.targetElement.offsetHeight;
    screenX2 = parseInt(screenX/2, 10);
    docHeight = document.body.offsetHeight;
  };

  this.freeze = () => {
    // pause animation
    if (!storm.disabled) {
      storm.disabled = 1;
    } else {
      return false;
    }
    storm.timer = null;
  };

  this.resume = () => {
    if (storm.disabled) {
       storm.disabled = 0;
    } else {
      return false;
    }
    storm.timerInit();
  };

  this.toggleSnow = () => {
    if (!storm.flakes.length) {
      // first run
      storm.start();
    } else {
      storm.active = !storm.active;
      if (storm.active) {
        storm.show();
        storm.resume();
      } else {
        storm.stop();
      }
    }
  };

  this.stop = function() {
    let i;
    this.freeze();
    for (i = storm.flakes.length - 1; i>= 0; i--) {
      storm.flakes[i].destruct();
    }
    storm.flakes = [];
    /*
    for (i=0; i<this.flakes.length; i++) {
      this.flakes[i]._style.setProperty('display', 'none');
    }
    */
    storm.events.remove(window,'scroll',storm.scrollHandler);
    storm.events.remove(window,'resize',storm.resizeHandler);
    if (storm.freezeOnBlur) {
      if (isIE) {
        storm.events.remove(document,'focusout',storm.freeze);
        storm.events.remove(document,'focusin',storm.resume);
      } else {
        storm.events.remove(window,'blur',storm.freeze);
        storm.events.remove(window,'focus',storm.resume);
      }
    }
    didInit = false;
  };

  this.show = function() {
    let i;
    for (i=0; i<this.flakes.length; i++) {
      this.flakes[i]._style.setProperty('display', 'block');
    }
  };

  this.SnowFlake = function(type,x,y) {
    const s = this;
    this.type = type;
    this.x = x||parseInt(rnd(screenX-20),10);
    this.y = (!isNaN(y)?y:-rnd(screenY)-12);
    this.vX = null;
    this.vY = null;
    this.vMaxX = parseFloat(storm.vMaxX);
    this.vMaxY = parseFloat(storm.vMaxX);
    this.vAmpTypes = [1,1.2,1.4,1.6,1.8]; // "amplification" for vX/vY (based on flake size/type)
    this.vAmp = this.vAmpTypes[this.type] || 1;
    this.opacity = 0.5 + (Math.random() * 0.5),
    this.melting = false;
    this.meltFrameCount = storm.meltFrameCount;
    this.meltFrames = [];
    for (let i=0; i<storm.meltFrameCount; i++) {
      this.meltFrames.push(this.opacity - (this.opacity * (i/storm.meltFrameCount)));
    }
    this.meltFrame = 0;
    this.twinkleFrame = 0;
    this.active = 1;
    this.fontSize = (10+(this.type/5)*10);
    this.scale = 0.25 + (Math.random() * 0.15);
    this.o = document.createElement('div');
    this._style = {
      getPropertyValue: this.o.style.getPropertyValue.bind(this.o.style),
      setProperty: this.o.style.setProperty.bind(this.o.style)
    };
    this.snowCharacter = storm.snowCharacter.toString();
    this.o.innerHTML = this.snowCharacter;
    if (storm.className) {
      this.o.setAttribute('class', storm.className);
    }
    this._style.setProperty('color', storm.snowColor);
    this._style.setProperty('position', fixedForEverything ? 'fixed' : 'absolute');
    if (storm.useGPU && features.transform.prop) {
      // GPU-accelerated snow.
      this._style.setProperty(features.transform.prop, 'translate3d(0px, 0px, 0px) scale3d(0.5,0.5,1)');
      // this.o.style.willChange = 'transform, opacity';
    }
    this._style.setProperty('width', `${storm.flakeWidth}px`);
    this._style.setProperty('height', `${storm.flakeHeight}px`);
    this._style.setProperty('font-family', 'arial,verdana');
    this._style.setProperty('pointer-events', 'none');

    s._style.setProperty('font-size', `${s.fontSize}px`);
    // s._style.setProperty('line-height', `${storm.flakeHeight+2}px`);
    // s._style.setProperty('text-align', 'center');
    // s._style.setProperty('vertical-align', 'baseline');

    s._style.setProperty('image-rendering', 'optimizeSpeed');
    
    // this.o.style.overflow = 'hidden';
    this._style.setProperty('z-index', storm.zIndex);
   
    storm.targetElement.appendChild(this.o);

    this.refresh = () => {
      if (isNaN(s.x) || isNaN(s.y)) {
        // safety check
        return false;
      }
      storm.setXY(s);
    };

    this.stick = () => {
      if (noFixed || (storm.targetElement !== document.documentElement && storm.targetElement !== document.body)) {
        s._style.setProperty(features.transform.prop, `translate3d(${x - storm.flakeWidth}px, ${screenY+scrollY-storm.flakeHeight}px, 0px) scale3d(0.5,0.5,1)`);
        // s.o.style.top = (screenY+scrollY-storm.flakeHeight)+'px';
      } else if (storm.flakeBottom) {
        this._style.setProperty('top', `${storm.flakeBottom}px`);
      } else {
        this._style.setProperty('display', 'none');
        this._style.setProperty('bottom', '0%');
        this._style.setProperty('position', 'fixed');
        this._style.setProperty('display', 'block');
      }
    };

    this.vCheck = () => {
      if (s.vX>=0 && s.vX<0.2) {
        s.vX = 0.2;
      } else if (s.vX<0 && s.vX>-0.2) {
        s.vX = -0.2;
      }
      if (s.vY>=0 && s.vY<0.2) {
        s.vY = 0.2;
      }
    };

    this.move = () => {
      const vX = s.vX*windOffset;
      let yDiff;
      s.x += vX;
      s.y += (s.vY*s.vAmp);
      if (s.x >= screenX || screenX-s.x < storm.flakeWidth) { // X-axis scroll check
        s.x = 0;
      } else if (vX < 0 && s.x-storm.flakeLeftOffset < -storm.flakeWidth) {
        s.x = screenX-storm.flakeWidth-1; // flakeWidth;
      }
      s.refresh();
      yDiff = screenY+scrollY-s.y+storm.flakeHeight;
      if (yDiff<storm.flakeHeight) {
        s.active = 0;
        if (storm.snowStick) {
          s.stick();
        } else {
          s.recycle();
        }
      } else {
        if ((storm.useMeltEffect || !storm.flakesMax) && s.active && s.type < 3 && !s.melting && (Math.random()>0.998 || !storm.flakesMax)) {
          // ~1/1000 chance of melting mid-air, with each frame
          s.melting = true;
          s.melt();
          // only incrementally melt one frame
          // s.melting = false;
        }
        if (storm.useTwinkleEffect) {
          if (s.twinkleFrame < 0) {
            if (Math.random() > 0.97) {
              s.twinkleFrame = parseInt(Math.random() * 8, 10);
            }
          } else {
            s.twinkleFrame--;
            if (!opacitySupported) {
              s._style.setProperty('visibility', (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 'hidden' : 'visible'));
            } else {
              s.setOpacity(s, s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 0 : s.opacity);
            }
          }
        }
      }
    };

    this.animate = () => {
      // main animation loop
      // move, check status, die etc.
      s.move();
    };

    this.setVelocities = () => {
      s.vX = vRndX+rnd(s.vMaxX*0.12,0.1);
      s.vY = vRndY+rnd(s.vMaxY*0.12,0.1);
    };

    this.setOpacity = (o, opacity) => {
      if (!opacitySupported) {
        return false;
      }
      o._style.setProperty('opacity', opacity);
    };

    this.melt = () => {
      if ((!storm.useMeltEffect || !s.melting) && storm.flakesMax) {
        s.recycle();
      } else {
        
        if (s.meltFrame < s.meltFrameCount) {
          s.setOpacity(s,s.meltFrames[s.meltFrame]);
          // s.o.style.fontSize = s.fontSize-(s.fontSize*(s.meltFrame/s.meltFrameCount))+'px';
          // s.o.style.lineHeight = storm.flakeHeight+2+(storm.flakeHeight*0.75*(s.meltFrame/s.meltFrameCount))+'px';
          s.meltFrame++;
        } else {
          s.recycle();
        }
      }
    };

    this.recycle = () => {

      // if over limit, remove
      if (storm.flakes.length > storm.flakesMax) {
        storm.flakes.splice(storm.flakes.indexOf(s), 1);
        s.destruct();
        return;
      }

      // s.o.style.display = 'none';
      s._style.setProperty('position', fixedForEverything ? 'fixed' : 'absolute');
      s._style.setProperty('bottom', 'auto');
      s._style.setProperty('top', '0px');
      s._style.setProperty('left', '0px');
      s.setVelocities();
      s.vCheck();
      s.meltFrame = 0;
      s.melting = false;
      s.setOpacity(s,s.opacity);
      s._style.setProperty('will-change', '');
      if (s.snowCharacter !== storm.snowCharacter) {
        s.snowCharacter = storm.snowCharacter.toString();
        s.o.innerHTML = s.snowCharacter;
      }
      s.x = parseInt(rnd(screenX-storm.flakeWidth-20),10);
      s.y = parseInt(rnd(screenY)*-1,10)-storm.flakeHeight;
      s.refresh();
      // s.o.style.display = 'block';
      s.active = 1;
    };

    this.destruct = () => {
      s._style = null;
      s.o.remove();
      s.o = null;
    }

    this.recycle(); // set up x/y coords etc.
    this.refresh();

  };

  this.snow = () => {
    /*
    if (storm.timer) {
      features.getAnimationFrame(storm.snow);
    }
    */
   if (!storm.timer) return;

   if (storm.flakes.length < storm.flakesMax) {
    storm.createSnow(1);
   }

    let active = 0, flake = null, i;
    for (i = storm.flakes.length - 1; i>= 0; i--) {
      if (storm.flakes[i].active === 1) {
        // note: move may cause a destruct.
        storm.flakes[i].move();
        active++;
      }

      if (storm.flakes[i]?.melting) {
        storm.flakes[i].melt();
      }
    }
    if (active<storm.flakesMaxActive || !storm.flakesMaxActive) {
      flake = storm.flakes[parseInt(rnd(storm.flakes.length),10)];
      if (flake?.active === 0) {
        flake.melting = true;
      }
    }

    // nothing left to do?
    if (!storm.flakes.length) {
      storm.stop();
    }

  };

  this.mouseMove = e => {
    if (!storm.followMouse) {
      return true;
    }
    let x = parseInt(e.clientX,10);
    if (x<screenX2) {
      windOffset = -windMultiplier+(x/screenX2*windMultiplier);
    } else {
      x -= screenX2;
      windOffset = (x/screenX2)*windMultiplier;
    }
    if (vRndX > 0) {
      windOffset *= -1;
    }
  };

  this.activeTouch = null;

  this.getActiveTouch = e => {
    if (!e?.changedTouches?.length || !this.activeTouch) return;
    const touches = e.changedTouches;
    let result;
    for (var i = 0, j = touches.length; i < j; i++) {
      if (touches[i].identifier === this.activeTouch.identifier) {
        result = touches[i];
        break;
      }
    }
    return result;
  }

  this.touchStart = e => {
    // grab and store the first touch event.
    if (this.activeTouch) return;
    this.activeTouch = e.changedTouches[0];
  };

  this.touchMove = e => {
    // get the "originating" touch event, and call mousemove() accordingly.
    if (!this.activeTouch) return;
    const touch = this.getActiveTouch(e);
    if (!touch) return;
    this.mouseMove(touch);
  }

  this.touchEnd = e => {
    const touch = this.getActiveTouch(e);
    if (!touch) return;
    this.activeTouch = null;
  }

  this.createSnow = (limit, allowInactive) => {
    let i;
    for (i=0; i<limit; i++) {
      storm.flakes.push(new storm.SnowFlake(parseInt(rnd(flakeTypes),10)));
      if (allowInactive || i>storm.flakesMaxActive) {
        storm.flakes[storm.flakes.length-1].active = -1;
      }
    }
  };

  this.timerInit = () => {
    storm.timer = true;
    storm.snow();
  };

  this.init = () => {
    let i;
    for (i=0; i<storm.meltFrameCount; i++) {
      storm.meltFrames.push(1-(i/storm.meltFrameCount));
    }
    storm.randomizeWind();
    // storm.createSnow(storm.flakesMax); // create initial batch
    storm.events.add(window,'resize',storm.resizeHandler);
    storm.events.add(window,'scroll',storm.scrollHandler);
    if (storm.freezeOnBlur) {
      if (isIE) {
        storm.events.add(document,'focusout',storm.freeze);
        storm.events.add(document,'focusin',storm.resume);
      } else {
        storm.events.add(window,'blur',storm.freeze);
        storm.events.add(window,'focus',storm.resume);
      }
    }
    storm.resizeHandler();
    storm.scrollHandler();

    if (storm.followMouse) {
      storm.events.add(isIE?document:window,'mousemove',storm.mouseMove);
      if (isMobile) {
        storm.events.add(document, 'touchstart', storm.touchStart);
        storm.events.add(document, 'touchmove', storm.touchMove);
        storm.events.add(document, 'touchend', storm.touchEnd);
        storm.events.add(document, 'touchcancel', storm.touchEnd);
      }
    }
    storm.animationInterval = Math.max(20,storm.animationInterval);
    storm.timerInit();
  };

  this.start = (bFromOnLoad = false) => {
    storm.resume();
    if (!didInit) {
      didInit = true;
    } else if (bFromOnLoad) {
      // already loaded and running
      return true;
    }
    if (typeof storm.targetElement === 'string') {
      const targetID = storm.targetElement;
      storm.targetElement = document.getElementById(targetID);
      if (!storm.targetElement) {
        throw new Error(`Snowstorm: Unable to get targetElement "${targetID}"`);
      }
    }
    if (!storm.targetElement) {
      storm.targetElement = (document.body || document.documentElement);
    }
    if (storm.targetElement !== document.documentElement && storm.targetElement !== document.body) {
      // re-map handler to get element instead of screen dimensions
      storm.resizeHandler = storm.resizeHandlerAlt;
      //and force-enable pixel positioning
      storm.usePixelPosition = true;
    }
    
    storm.usePositionFixed = (storm.usePositionFixed && !noFixed && !storm.flakeBottom); // whether or not position:fixed is to be used
    if (window.getComputedStyle) {
      // attempt to determine if body or user-specified snow parent element is relatively-positioned.
      try {
        targetElementIsRelative = (window.getComputedStyle(storm.targetElement, null).getPropertyValue('position') === 'relative');
      } catch(e) {
        // oh well
        targetElementIsRelative = false;
      }
    }
    fixedForEverything = storm.usePositionFixed;

    // be nice and wait a minute before hitting the DOM.
    window.requestAnimationFrame(() => {
      storm.resizeHandler(); // get bounding box elements
      if (screenX && screenY && !storm.disabled) {
        storm.init();
        storm.active = true;
      }
    });
  };

  function doDelayedStart() {
    window.setTimeout(() => {
      storm.start(true);
    }, 20);
    // event cleanup
    storm.events.remove(isIE?document:window,'mousemove',doDelayedStart);
  }

  function doStart() {
    if (!storm.excludeMobile || !isMobile) {
      doDelayedStart();
    }
    // event cleanup
    storm.events.remove(window, 'load', doStart);
  }

  // hooks for starting the snow
  if (storm.autoStart) {
    storm.events.add(window, 'load', doStart, false);
  }

  return this;
}

const snowStorm = new SnowStorm(window, document);

export { snowStorm };