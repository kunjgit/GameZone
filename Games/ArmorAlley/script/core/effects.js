import { rng, worldHeight } from '../core/global.js';
import { game } from '../core/Game.js';
import { domFettiBoom } from '../UI/DomFetti.js'
import { gamePrefs } from '../UI/preferences.js';
import { rnd, rndInt, plusMinus, rad2Deg, TYPES } from '../core/global.js';
import { Smoke } from '../elements/Smoke.js';
import { GunFire } from '../munitions/GunFire.js';
import { sprites } from './sprites.js';
import { common } from './common.js';
import { snowStorm } from '../lib/snowstorm.js';

let shrapnelToAdd = [];
const MAX_SHRAPNEL_PER_FRAME = 128;

function nextShrapnel() {

  if (!shrapnelToAdd.length) return;

  // no more than X at a time
  const max = Math.min(shrapnelToAdd.length, MAX_SHRAPNEL_PER_FRAME);

  let options;

  for (var i = 0; i < max; i++) {
    options = shrapnelToAdd.shift();
    game.addObject(TYPES.shrapnel, options);
  }

  game.objects.queue.addNextFrame(nextShrapnel);

}

const effects = {

  smokeRing: (item, smokeOptions) => {

    // don't create if not visible
    if (!item.data.isOnScreen) return;

    smokeOptions = smokeOptions || {};
    
    let angle, smokeArgs, angleIncrement, count, i, radians, velocityMax, vX, vY, vectorX, vectorY;

    angle = 0;

    // some sort of min / max
    velocityMax = smokeOptions.velocityMax || (3 + rnd(4));

    // # of smoke elements
    count = parseInt((smokeOptions.count ? smokeOptions.count / 2 : 5) + rndInt(smokeOptions.count || 11), 10);

    angleIncrement = 180 / count;

    // random: 50% to 100% of range
    vX = vY = (velocityMax / 2) + rnd(velocityMax / 2);

    for (i = 0; i < count; i++) {

      angle += (angleIncrement + plusMinus(rnd(angleIncrement * 0.25)));

      // calculate vectors for each element
      radians = angle * Math.PI / 90;

      vectorX = vX * Math.cos(radians);
      vectorY = vY * Math.sin(radians);

      // ground-based object, e.g., base? explode "up", and don't mirror the upper half.
      if (vectorY > 0 && smokeOptions.isGroundUnit) {
        vectorY *= -0.33;
        vectorX *= 0.33;
      }

      smokeArgs = {
        // fixedSpeed: true, // don't randomize vX / vY each time
        x: item.data.x + ((smokeOptions.offsetX || 0) || (item.data.halfWidth || 0)),
        y: item.data.y + ((smokeOptions.offsetY || 0) || (item.data.halfHeight || 0)),
        // account for some of parent object's motion, e.g., helicopter was moving when it blew up
        vX: (vectorX + ((smokeOptions.parentVX || 0) / 3)) * (1 + rnd(0.25)),
        vY: (vectorY + ((smokeOptions.parentVY || 0) / 3)) * (1 + rnd(0.25)),
        // spriteFrame: (Math.random() > 0.5 ? 0 : rndInt(5)),
        spriteFrameModulus: smokeOptions.spriteFrameModulus || 3,
        gravity: 0.25,
        deceleration: 0.98,
        increaseDeceleration: 0.9985
      };

      game.objects.smoke.push(Smoke(smokeArgs));

      // past a certain amount, create inner "rings"
      if (count >= 20 || velocityMax > 15) {

        // second inner ring
        if (i % 2 === 0) {
          game.objects.smoke.push(Smoke(
            common.mixin(smokeArgs, { vX: vectorX * 0.75, vY: vectorY * 0.75})
          ));
        }

        // third inner ring
        if (i % 3 === 0) {
          game.objects.smoke.push(Smoke(
            common.mixin(smokeArgs, { vX: vectorX * 0.66, vY: vectorY * 0.66})
          ));
        }

        // fourth inner ring
        if (i % 4 === 0) {
          game.objects.smoke.push(Smoke(
            common.mixin(smokeArgs, { vX: vectorX * 0.50, vY: vectorY * 0.50})
          ));
        }

      }

    }

  },

  smokeRelativeToDamage: (exports, chance = 1 - (exports?.data?.energy / exports?.data?.energyMax)) => {
    
    if (!exports || !exports.data || !exports.dom) return;

    // const data = exports.data;

    const { data } = exports;

    if (!data.isOnScreen) return;

    // first off: certain chance of no smoke, regardless of status
    if (Math.random() >= (chance || 0.66)) return;
    
    // a proper roll of the dice: smoke at random. higher damage = greater chance of smoke
    if (Math.random() < 1 - ((data.energyMax -data.energy) / data.energyMax)) return;

    const isBunker = (data.type == TYPES.bunker);
    const isTurret = (data.type === TYPES.turret);

    // bunkers can smoke across the whole thing
    const fractionWidth = isBunker ? data.halfWidth : data.halfWidth * 0.5;

    // TODO: clean this up. yuck.
    game.objects.smoke.push(Smoke({
      x: data.x + data.halfWidth + (parseInt(rnd(fractionWidth) * plusMinus(), 10)),
      y: data.y + data.halfHeight + (parseInt(rnd(data.halfHeight) * (isBunker ? 0.5 : 0.25) * (data.vY <= 0 ? -1 : 1), 10)),
      // if undefined or zero, allow smoke to go left or right
      // special handling for helicopters and turrets. this should be moved into config options.
      vX: (data.type === TYPES.helicopter ? rnd(1.5) * plusMinus() : (isBunker || isTurret) ? plusMinus(0.5 * chance) : (-(data.vX || 0) + rnd(1.5) * (data.vX === undefined || data.vX === 0 ? plusMinus() : 1))),
      vY: (isBunker || isTurret ? -rnd(5 * chance) : (data.type === TYPES.helicopter ? -rnd(3 * chance) : -(data.vY || 0.25) + rnd(-2)))
    }));

  },

  ephemeralExplosion: (options = {}) => {

    if (!options?.data) return;

    const oData = options.data;

    if (!oData.isOnScreen) return;

    // create an explosion animation at the given coordinates, center, and scale.

    let css, data, dom, exports;

    // as set in CSS
    const sprite_square_size = 100;

    css = {
      className: 'ephemeral-explosion'
    };

    data = common.inheritData({
      type: 'ephemeral-explosion', // hackish: so battlefield scroll offset is included
      frameCount: 0,
      frameCountMax: 45,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      scale: 1,
      extraTransform: null
    });

    dom = {
      o: null
    };

    function animate() {

      sprites.setTransformXY(exports, dom.o, `${data.x}px`, `${data.y}px`, data.extraTransform);

      const finished = (++data.frameCount >= data.frameCountMax);

      if (finished) sprites.removeNodes(dom);

      return finished;

    }

    function doLayout() {

      const adjustedWidth = Math.max(24, oData.width);

      // prevent extra-small sprite sizes, and possible vertical clipping
      const adjustedHeight = Math.max(24, oData.height);

      // set position and scale
      data.scale = adjustedWidth / sprite_square_size;

      // account for bottom-alignment
      data.x = oData.x + (adjustedWidth / 2);
      data.y = oData.y - adjustedHeight;

      // for game engine positioning
      data.width = oData.width;
      data.height = data.width; // square

      data.extraTransform = `translate3d(-50%, -50%, 0) scale3d(${data.scale},${data.scale},1)`;

    }

    function initDOM() {

      dom.o = sprites.create({
        className: css.className
      });

      doLayout();

    }

    initDOM();

    exports = {
      animate,
      data,
      dom
    };

    // add ourselves to the main game loop
    game.objects.ephemeralExplosion.push(exports);

    return exports;

  },

  inertGunfireExplosion: (options = {}) => {

    if (!options?.exports?.data) return;

    const { data } = options.exports;

    if (!data.isOnScreen) return;

    const vX = options.vX || (1.5 + rnd(1));
    const vY = options.vY || (1.5 + rnd(1));
    let gunfire;

    // create some inert (harmless) gunfire, as decorative shrapnel.
    for (let i = 0, j = options.count || (3 + rndInt(2)); i < j; i++) {

      gunfire = GunFire({
        parentType: data.type,
        isInert: true,
        // empty array may prevent collision, but `isInert` is provided explicitly for this purpose
        collisionItems: [],
        x: data.x + (data.halfWidth || 0),
        y: data.y,
        // if there are more "particles", allow them to move further.
        vX: rnd(vX) * plusMinus() * (j > 4 ? rnd(j / 2) : 1),
        vY: -rnd(Math.abs(vY)) * (j > 4 ? rnd(j / 2) : 1)
      });

      gunfire.init();

      game.objects.gunfire.push(gunfire);

    }

  },

  domFetti: (exports = {}, target = {}) => {

    if (!gamePrefs.domfetti) return;

    // target needs to be on-screen, or "nearby"

    if (!exports.data.isOnScreen && game.players.local) {
      // ignore if too far away
      if (Math.abs(game.players.local.data.x - exports.data.x) > game.objects.view.data.browser.twoThirdsWidth) return;
    }

    let widthOffset, heightOffset;

    // hackish: for bomb explosions
    if (exports.data.explosionWidth && exports.data.bottomAlign) {
      widthOffset = exports.data.explosionWidth / 2;
      heightOffset = exports.data.explosionHeight;
    } else {
      widthOffset = exports.data.halfWidth || 0;
      heightOffset = exports.data.halfHeight || 0;
    }

    const x = exports.data.x + widthOffset;
    const y = exports.data.y + heightOffset;

    game.objects.domFetti.push(domFettiBoom(exports, target, x, y));

  },

  shrapnelExplosion: (options = {}, shrapnelOptions = {}) => {

    let localOptions, halfWidth;

    let vX, vY, vectorX, vectorY, i, angle, shrapnelCount, angleIncrement, explosionVelocity1, explosionVelocity2, explosionVelocityMax;

    // important: make sure we delete the parent object's unique ID.
    localOptions = { ...options };
    delete localOptions.id;

    halfWidth = localOptions.width / 2;

    // randomize X?
    if (shrapnelOptions.centerX) {
      localOptions.x += halfWidth;
    } else {
      localOptions.x += rng(localOptions.width, TYPES.shrapnel);
    }

    // silly, but copy right over.
    if (shrapnelOptions.noInitialSmoke) {
      localOptions.noInitialSmoke = shrapnelOptions.noInitialSmoke;
    }

    const parentVX = (options.parentVX || 0) + (shrapnelOptions.parentVX || 0);
    const parentVY = (options.parentVY || 0) + (shrapnelOptions.parentVY || 0);

    // note: "in addition to" velocity option.
    vX = (options.velocity || 0) + (shrapnelOptions.velocity || 0) + (shrapnelOptions.vX || 0);
    vY = (options.velocity || 0) + (shrapnelOptions.velocity || 0) + (shrapnelOptions.vY || 0);

    angle = 0;

    // TODO: revisit
    explosionVelocityMax = 4.75;

    shrapnelCount = shrapnelOptions.count || 8;

    angleIncrement = 180 / (shrapnelCount - 1);

    for (i = 0; i < shrapnelCount; i++) {

      explosionVelocity1 = rng(explosionVelocityMax + vX, TYPES.shrapnel);
      explosionVelocity2 = rng(explosionVelocityMax + vY, TYPES.shrapnel);

      vectorX = -explosionVelocity1 * Math.cos(angle * rad2Deg);
      vectorY = -explosionVelocity2 * Math.sin(angle * rad2Deg);

      localOptions.vX = (localOptions.vX * 0.5) + vectorX;
      localOptions.vY += vectorY;

      // bottom-aligned object? explode "up".
      if (localOptions.vY > 0 && (options.bottomAligned || shrapnelOptions.bottomAligned)) {
        localOptions.vY *= -1;
      }

      // include parent velocity, too.
      localOptions.vX += (parentVX / 8);
      localOptions.vY += (parentVY / 10);

      // have first and last make noise
      localOptions.hasSound = (i === 0 || (shrapnelCount > 4 && i === shrapnelCount - 1));

      shrapnelToAdd.push({ ...localOptions });

      if (shrapnelToAdd.length === 1) {
        common.setFrameTimeout(nextShrapnel, 1);
      }

      angle += angleIncrement;

    }

  },

  damageExplosion: (exports) => {

    // given an object, create a bomb explosion there and make it dangerous to the object.
    // this rewards the player for - e.g., blowing up a bunker while a tank is passing by.

    const { data } = exports;

    if (!data) return;

    // special case: bunkers blow up "big" and will destroy any ground unit in one hit.
    const damagePoints = data.type === TYPES.bunker ? 10 : undefined;

    game.addObject(TYPES.bomb, {
      parent: exports,
      parentType: data.type,
      damagePoints,
      hidden: true,
      isEnemy: !data.isEnemy,
      x: data.x + data.halfWidth,
      y: worldHeight - 1,
      vX: 0,
      vY: 1
    });

    // additionally, create an additional explosion animation here.
    // exclude bunkers as they have a nuke animation, that's plenty. ;)
    if (data.type !== TYPES.bunker) {
      effects.ephemeralExplosion(exports);
    }

  },

  updateStormStyle: (style) => {

    if (!snowStorm) return;

    const defaultChar = '&bull;'

    let char = snowStorm.snowCharacter;

    // by default ...
    snowStorm.snowStick = false;

    if (style === 'rain') {

      char = '/';
      snowStorm.flakesMax = 256;
      snowStorm.flakesMaxActive = 256;
      snowStorm.vMaxX = 1;
      snowStorm.vMinY = 8;
      snowStorm.vMaxY = 20;

    } else if (style === 'hail') {

      char = '*';
      snowStorm.flakesMax = 128;
      snowStorm.flakesMaxActive = 128;
      // snowStorm.vMaxX = 1;
      snowStorm.vMinY = 4;
      snowStorm.vMaxY = 10;

    } else if (style === 'turd') {

      char = '💩';

      snowStorm.flakesMax = 96;
      snowStorm.flakesMaxActive = 96;
      // snowStorm.vMaxX = 0;
      snowStorm.vMinY = 2;
      snowStorm.vMaxY = 5;

    } else if (!style) {

      // none
      snowStorm.flakesMax = 0;
      snowStorm.flakesMaxActive = 0;

    } else {

      // snow case

      char = defaultChar;

      snowStorm.flakesMax = 72;
      snowStorm.flakesMaxActive = 72;
      // snowStorm.vMaxX = 0;
      snowStorm.vMinY = 0.5;
      snowStorm.vMaxY = 2.5;
      snowStorm.snowStick = true;

    }

    // so all newly-created snow looks right...
    snowStorm.snowCharacter = char;

    // ensure we start, if we haven't yet.
    snowStorm.start();

    // simulate event w/last recorded one
    const source = game.isMobile ? game.objects?.joystick?.data?.lastMove : game.objects?.view?.data?.mouse;

    if (!source) return;

    const { clientX, clientY } = source;

    snowStorm.mouseMove({ clientX, clientY })

  }

}

export { effects }