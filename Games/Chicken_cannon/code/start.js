let ratio = 0.6;

let ww = window.innerWidth;let wh = window.innerHeight;let kaboomDimensions = {};if (ww * ratio > wh) {kaboomDimensions = { w: wh / ratio,h: wh};} else {kaboomDimensions = {w: ww,h: ww * ratio};};

kaboom({
  background: [160,160,160],
  width: kaboomDimensions.w,
  height: kaboomDimensions.h,
  letterbox: true,
  inspectColor: [255,255,255],
  pixelDensity: 1/*Math.min(3, 1000 / kaboomDimensions.w)*/,
  crisp: true,
});

function ls(a,b) {
  if (b == undefined) {
    loadSprite(a, `${a}.png`); 
  } else {
    loadSprite(a, `${a}.png`, b);
  };
};

const SCALE = width()/10;
const SIZE = 400;
const TILE = SCALE / SIZE;
const FADE_TIME = 150;

loadFont('rubik', 'fonts/rubik.ttf');
loadFont('ubuntu', 'fonts/ubuntu.ttf');
loadFont('manrope', 'fonts/manrope.ttf');

loadRoot('sprites/');

ls('cannon', { sliceX: 3 });
ls('chicken', { sliceX: 2 });
ls('ground');
ls('collectables', { sliceX: 14 });
ls('rocket', { sliceX: 2 });

loadSpriteAtlas('shopBuilder.png', {
  'shopRoof': {
    x: 0, y: 0,
    width: SIZE*2, height: SIZE,
    sliceX: 2,
  },
  'box': {
    x: SIZE*2, y: 0,
    width: SIZE*2, height: SIZE,
    sliceX: 2,
  },
  'shopNav': {
    x: SIZE*4, y: 0,
    width: SIZE*2, height: SIZE,
    sliceX: 2,
  },
  'shopGroove': {
    x: SIZE*6, y: 0,
    width: SIZE, height: SIZE,
  },
  'attention': {
    x: SIZE*7, y: 0,
    width: SIZE, height: SIZE,
  },
});

ls('upgrades', { sliceX: 6 });
ls('logo');

loadSpriteAtlas('gameExtras.png', {
  'trampoline': {
    x: 0, y: 0,
    width: SIZE, height: SIZE,
  },
  'cloud': {
    x: SIZE, y: 0,
    width: SIZE, height: SIZE,
  },
  'flora': {
    x: SIZE*2, y: 0,
    width: SIZE*3, height: SIZE,
    sliceX: 3,
  },
  'goldenEgg': {
    x: SIZE*5, y: 0,
    width: SIZE, height: SIZE,
  },
  'vaporCone': {
    x: SIZE*6, y: 0,
    width: SIZE, height: SIZE,
  },
});

ls('outline');