let sprites = {};
let sounds = {};
let colors = {};
let dimensions = {};

var loading = 0;
var maxLoading = 0;

function loadAssets() {
  //\\//\\ LOADING //\\//\\
  sprites['loading-text'] = loadSprite('loading/loading-text');
  sprites['loading-box'] = loadSprite('loading/loading-box');
  Outrun.drawLoading();
  //\\//\\ MENU ASSETS //\\//\\
  // LOADING MENU SPRITES
  sprites['logo-bg-0'] = loadSprite('menu/logo-bg-0');
  sprites['logo-bg-1'] = loadSprite('menu/logo-bg-1');
  sprites['logo-bg-2'] = loadSprite('menu/logo-bg-2');
  sprites['logo-bg-3'] = loadSprite('menu/logo-bg-3');
  sprites['logo-bg-4'] = loadSprite('menu/logo-bg-4');
  sprites['logo-bg-5'] = loadSprite('menu/logo-bg-5');
  sprites['logo-road'] = loadSprite('menu/logo-road');
  sprites['logo-car'] = loadSprite('menu/logo-car');
  sprites['logo-tree-0'] = loadSprite('menu/logo-tree-0');
  sprites['logo-tree-1'] = loadSprite('menu/logo-tree-1');
  sprites['logo-tree-2'] = loadSprite('menu/logo-tree-2');
  sprites['logo-text'] = loadSprite('menu/logo-text');
  //\\//\\ RADIO ASSETS //\\//\\
  // LOADING RADIO SPRITES
  sprites['radio-car'] = loadSprite('radio/radio-car');
  sprites['radio'] = loadSprite('radio/radio');
  sprites['radio-freq-0'] = loadSprite('radio/radio-freq-0');
  sprites['radio-freq-1'] = loadSprite('radio/radio-freq-1');
  sprites['radio-freq-2'] = loadSprite('radio/radio-freq-2');
  sprites['radio-dot-red'] = loadSprite('radio/radio-dot-red');
  sprites['radio-dot-green'] = loadSprite('radio/radio-dot-green');
  sprites['radio-hand-0'] = loadSprite('radio/radio-hand-0');
  sprites['radio-hand-1'] = loadSprite('radio/radio-hand-1');
  sprites['radio-hand-2'] = loadSprite('radio/radio-hand-2');
  // LOADING RADIO SAMPLES
  sounds['wave'] = loadSound('sample/wave');
  sounds['coin'] = loadSound('sample/coin');
  sounds['signal-0'] = loadSound('sample/signal-0');
  sounds['signal-1'] = loadSound('sample/signal-1');
  Outrun.drawLoading();
  //\\//\\ IN-GAME ASSETS //\\//\\
  // LOADING IN-GAME SPRITES
  var tunnel = loadSprite('environment/tunnel');
  sprites['coconut-beach'] = {
    back: loadSprite('background/coconut-beach/back'),
    front: loadSprite('background/coconut-beach/front'),
    tunnel: tunnel,
    terrain: loadSprite('environment/coconut-beach/terrain'),
    left1: loadSprite('environment/coconut-beach/sail-1'),
    left2: loadSprite('environment/coconut-beach/sail-2'),
    right1: loadSprite('environment/coconut-beach/tree'),
    right2: loadSprite('environment/coconut-beach/bush'),
    start0: loadSprite('environment/start-flag-0'),
    start1: loadSprite('environment/start-flag-1'),
    start2: loadSprite('environment/start-flag-2'),
    start3: loadSprite('environment/start-flag-3')
  };
  dimensions['coconut-beach'] = {
    tunnel: createDimension(4800, 2000, 0),
    terrain: createDimension(9760, 320, -9500),
    left1: createDimension(765, 1500, -8000),
    left2: createDimension(765, 1500, -9000),
    right1: createDimension(1170, 2520, 5000),
    right2: createDimension(1280, 790, 5000),
    start0: createDimension(4720, 1760, -2000),
    start1: createDimension(4720, 1760, -2000),
    start2: createDimension(4720, 1760, -2000),
    start3: createDimension(4720, 1760, -2000),
  };
  sprites['gateaway'] = {
    back: loadSprite('background/gateaway/back'),
    front: loadSprite('background/gateaway/front'),
    tunnel: tunnel,
    terrain: loadSprite('environment/gateaway/terrain'),
    left1: loadSprite('environment/gateaway/arcade-sign'),
    left2: loadSprite('environment/gateaway/motorcycle-sign'),
    right1: loadSprite('environment/gateaway/castle'),
    right2: loadSprite('environment/gateaway/castle')
  };
  dimensions['gateaway'] = {
    tunnel: createDimension(4800, 2000, 0),
    terrain: createDimension(9760, 320, -9500),
    left1: createDimension(1250, 1690, -6000),
    left2: createDimension(1080, 1030, -6000),
    right1: createDimension(1230, 1830, 5000),
    right2: createDimension(1230, 1830, 5000)
  };
  sprites['devils-canyon'] = {
    back: loadSprite('background/devils-canyon/back'),
    front: loadSprite('background/devils-canyon/front'),
    tunnel: tunnel,
    terrain: loadSprite('environment/devils-canyon/terrain'),
    left1: loadSprite('environment/devils-canyon/sega-sign'),
    left2: loadSprite('environment/devils-canyon/diving-sign'),
    right1: loadSprite('environment/devils-canyon/rock'),
    right2: loadSprite('environment/devils-canyon/rock')
  };
  dimensions['devils-canyon'] = {
    tunnel: createDimension(4800, 2000, 0),
    terrain: createDimension(9760, 320, -9500),
    left1: createDimension(1440, 920, -6000),
    left2: createDimension(1160, 800, -6000),
    right1: createDimension(1720, 1780, 5000),
    right2: createDimension(1720, 1780, 5000)
  };
  sprites['desert'] = {
    back: loadSprite('background/desert/back'),
    front: loadSprite('background/desert/front'),
    tunnel: tunnel,
    left1: loadSprite('environment/desert/dry-tree'),
    left2: loadSprite('environment/desert/dry-tree'),
    right1: loadSprite('environment/desert/terrain'),
    right2: loadSprite('environment/desert/terrain')
  };
  dimensions['desert'] = {
    tunnel: createDimension(4800, 2000, 0),
    left1: createDimension(440, 760, -5000),
    left2: createDimension(440, 760, 5000),
    right1: createDimension(9760, 320, -9500),
    right2: createDimension(9760, 320, 9500)
  };
  Outrun.drawLoading();
  sprites['alps'] = {
    back: loadSprite('background/alps/back'),
    front: loadSprite('background/alps/front'),
    tunnel: tunnel,
    left1: loadSprite('environment/alps/mill-1'),
    left2: loadSprite('environment/alps/mill-2'),
    right1: loadSprite('environment/alps/terrain-1'),
    right2: loadSprite('environment/alps/terrain-2')
  };
  dimensions['alps'] = {
    tunnel: createDimension(4800, 2000, 0),
    left1: createDimension(1080, 1400, 6000),
    left2: createDimension(1080, 1400, -6000),
    right1: createDimension(9760, 320, -9500),
    right2: createDimension(9760, 320, 9500)
  };
  sprites['cloudy-mountain'] = {
    back: loadSprite('background/cloudy-mountain/back'),
    front: loadSprite('background/cloudy-mountain/front'),
    tunnel: tunnel,
    terrain: loadSprite('environment/cloudy-mountain/clouds'),
    right1: loadSprite('environment/cloudy-mountain/tree'),
    right2: loadSprite('environment/cloudy-mountain/tree')
  };
  dimensions['cloudy-mountain'] = {
    tunnel: createDimension(4800, 2000, 0),
    terrain: createDimension(19250, 3000, 0),
    right1: createDimension(2480, 2480, -6000),
    right2: createDimension(2480, 2480, 6000)
  };
  sprites['wilderness'] = {
    back: loadSprite('background/wilderness/back'),
    front: loadSprite('background/wilderness/front'),
    tunnel: tunnel,
    left1: loadSprite('environment/wilderness/rock-1'),
    left2: loadSprite('environment/wilderness/rock-2'),
    right1: loadSprite('environment/wilderness/cut-tree'),
    right2: loadSprite('environment/wilderness/dry-tree')
  };
  dimensions['wilderness'] = {
    tunnel: createDimension(4800, 2000, 0),
    left1: createDimension(1160, 420, 6000),
    left2: createDimension(1160, 550, -6000),
    right1: createDimension(885, 660, 6000),
    right2: createDimension(880, 1530, -5000)
  };
  sprites['old-capital'] = {
    back: loadSprite('background/old-capital/back'),
    front: loadSprite('background/old-capital/front'),
    tunnel: tunnel,
    left1: loadSprite('environment/old-capital/tower'),
    left2: loadSprite('environment/old-capital/hut'),
    right1: loadSprite('environment/old-capital/tree-1'),
    right2: loadSprite('environment/old-capital/tree-2')
  };
  dimensions['old-capital'] = {
    tunnel: createDimension(4800, 2000, 0),
    left1: createDimension(720, 1640, -5000),
    left2: createDimension(1200, 860, -6000),
    right1: createDimension(945, 2400, 5500),
    right2: createDimension(1740, 1980, 6000)
  };
  sprites['wheat-field'] = {
    back: loadSprite('background/wheat-field/back'),
    front: loadSprite('background/wheat-field/front'),
    tunnel: tunnel,
    left1: loadSprite('environment/wheat-field/motorcycle-sign'),
    left2: loadSprite('environment/wheat-field/tree'),
    right1: loadSprite('environment/wheat-field/terrain'),
    right2: loadSprite('environment/wheat-field/terrain'),
  };
  dimensions['wheat-field'] = {
    tunnel: createDimension(4800, 2000, 0),
    left1: createDimension(1080, 1030, -6000),
    left2: createDimension(1740, 1980, -6000),
    right1: createDimension(9760, 320, 9500),
    right2: createDimension(9760, 320, 9500)
  };
  Outrun.drawLoading();
  sprites['seaside-town'] = {
    back: loadSprite('background/seaside-town/back'),
    front: loadSprite('background/seaside-town/front'),
    tunnel: tunnel,
    terrain: loadSprite('environment/seaside-town/terrain'),
    right1: loadSprite('environment/seaside-town/tower'),
    right2: loadSprite('environment/seaside-town/hut')
  };
  dimensions['seaside-town'] = {
    tunnel: createDimension(4800, 2000, 0),
    terrain: createDimension(9760, 320, -9500),
    right1: createDimension(720, 1640, 5000),
    right2: createDimension(1200, 860, 5500)
  };
  sprites['vineyard'] = {
    back: loadSprite('background/vineyard/back'),
    front: loadSprite('background/vineyard/front'),
    tunnel: tunnel,
    right1: loadSprite('environment/vineyard/terrain'),
    right2: loadSprite('environment/vineyard/terrain'),
    goal: loadSprite('environment/goal')
  };
  dimensions['vineyard'] = {
    tunnel: createDimension(4800, 2000, 0),
    right1: createDimension(6600, 650, 7700),
    right2: createDimension(6600, 650, -7700),
    goal: createDimension(9010, 1760, 0)
  };
  sprites['death-valley'] = {
    back: loadSprite('background/death-valley/back'),
    front: loadSprite('background/death-valley/front'),
    tunnel: tunnel,
    left1: loadSprite('environment/death-valley/danke-sign'),
    left2: loadSprite('environment/death-valley/rock'),
    right1: loadSprite('environment/death-valley/pebbles'),
    right2: loadSprite('environment/death-valley/pebbles'),
    goal: loadSprite('environment/goal')
  };
  dimensions['death-valley'] = {
    tunnel: createDimension(4800, 2000, 0),
    left1: createDimension(1120, 730, -6000),
    left2: createDimension(440, 970, -5000),
    right1: createDimension(2420, 160, 7000),
    right2: createDimension(2420, 160, -7000),
    goal: createDimension(9010, 1760, 0)
  };
  sprites['desolation-hill'] = {
    back: loadSprite('background/desolation-hill/back'),
    front: loadSprite('background/desolation-hill/front'),
    tunnel: tunnel,
    right1: loadSprite('environment/desolation-hill/rock-1'),
    right2: loadSprite('environment/desolation-hill/rock-2'),
    goal: loadSprite('environment/goal')
  };
  dimensions['desolation-hill'] = {
    tunnel: createDimension(4800, 2000, 0),
    right1: createDimension(1160, 420, 6000),
    right2: createDimension(1160, 420, -6000),
    goal: createDimension(9010, 1760, 0)
  };
  sprites['autobahn'] = {
    back: loadSprite('background/autobahn/back'),
    front: loadSprite('background/autobahn/front'),
    tunnel: tunnel,
    left1: loadSprite('environment/autobahn/bush-1'),
    left2: loadSprite('environment/autobahn/bush-2'),
    right1: loadSprite('environment/autobahn/tree'),
    right2: loadSprite('environment/autobahn/tree'),
    goal: loadSprite('environment/goal')
  };
  dimensions['autobahn'] = {
    tunnel: createDimension(4800, 2000, 0),
    left1: createDimension(840, 560, -5000),
    left2: createDimension(1260, 530, -5500),
    right1: createDimension(2480, 2480, 6000),
    right2: createDimension(2480, 2480, 6000),
    goal: createDimension(9010, 1760, 0)
  };
  sprites['lakeside'] = {
    back: loadSprite('background/lakeside/back'),
    front: loadSprite('background/lakeside/front'),
    tunnel: tunnel,
    right1: loadSprite('environment/lakeside/tree'),
    right2: loadSprite('environment/lakeside/tree'),
    goal: loadSprite('environment/goal')
  };
  dimensions['lakeside'] = {
    tunnel: createDimension(4800, 2000, 0),
    right1: createDimension(1800, 1890, 6000),
    right2: createDimension(1800, 1890, -6000),
    goal: createDimension(9010, 1760, 0)
  };
  Outrun.drawLoading();
  // LOADING FERRARI SPRITES
  for (var i = 0; i < 2; i++) {
    sprites['down-hardleft-' + i] = loadSprite('ferrari/down-hardleft-' + i);
    sprites['down-hardright-' + i] = loadSprite('ferrari/down-hardright-' + i);
    sprites['down-left-' + i] = loadSprite('ferrari/down-left-' + i);
    sprites['down-right-' + i] = loadSprite('ferrari/down-right-' + i);
    sprites['down-straight-' + i] = loadSprite('ferrari/down-straight-' + i);

    sprites['hardleft-' + i] = loadSprite('ferrari/hardleft-' + i);
    sprites['hardright-' + i] = loadSprite('ferrari/hardright-' + i);
    sprites['left-' + i] = loadSprite('ferrari/left-' + i);
    sprites['right-' + i] = loadSprite('ferrari/right-' + i);
    sprites['straight-' + i] = loadSprite('ferrari/straight-' + i);

    sprites['up-hardleft-' + i] = loadSprite('ferrari/up-hardleft-' + i);
    sprites['up-hardright-' + i] = loadSprite('ferrari/up-hardright-' + i);
    sprites['up-left-' + i] = loadSprite('ferrari/up-left-' + i);
    sprites['up-right-' + i] = loadSprite('ferrari/up-right-' + i);
    sprites['up-straight-' + i] = loadSprite('ferrari/up-straight-' + i);


    sprites['down-hardleft-brake-' + i] = loadSprite('ferrari/down-hardleft-brake-' + i);
    sprites['down-hardright-brake-' + i] = loadSprite('ferrari/down-hardright-brake-' + i);
    sprites['down-left-brake-' + i] = loadSprite('ferrari/down-left-brake-' + i);
    sprites['down-right-brake-' + i] = loadSprite('ferrari/down-right-brake-' + i);
    sprites['down-straight-brake-' + i] = loadSprite('ferrari/down-straight-brake-' + i);

    sprites['hardleft-brake-' + i] = loadSprite('ferrari/hardleft-brake-' + i);
    sprites['hardright-brake-' + i] = loadSprite('ferrari/hardright-brake-' + i);
    sprites['left-brake-' + i] = loadSprite('ferrari/left-brake-' + i);
    sprites['right-brake-' + i] = loadSprite('ferrari/right-brake-' + i);
    sprites['straight-brake-' + i] = loadSprite('ferrari/straight-brake-' + i);

    sprites['up-hardleft-brake-' + i] = loadSprite('ferrari/up-hardleft-brake-' + i);
    sprites['up-hardright-brake-' + i] = loadSprite('ferrari/up-hardright-brake-' + i);
    sprites['up-left-brake-' + i] = loadSprite('ferrari/up-left-brake-' + i);
    sprites['up-right-brake-' + i] = loadSprite('ferrari/up-right-brake-' + i);
    sprites['up-straight-brake-' + i] = loadSprite('ferrari/up-straight-brake-' + i);
  }
  Outrun.drawLoading();
  // LOADING IN-GAME MUSIC
  sounds['music-0'] = loadSound('music/music-0');
  sounds['music-1'] = loadSound('music/music-1');
  sounds['music-2'] = loadSound('music/music-2');
  //\\//\\ TEXT ASSETS //\\//\\
  sprites['press-enter'] = loadSprite('text/press-enter');
  sprites['select-music'] = loadSprite('text/select-music');
  sprites['music-0'] = loadSprite('text/music-0');
  sprites['music-1'] = loadSprite('text/music-1');
  sprites['music-2'] = loadSprite('text/music-2');
  //\\//\\ VEHICLES //\\//\\
  for (var i = 0; i < 11; i++) {
    sprites['vehicle-' + i] = {
      right0: loadSprite('vehicles/vehicle-' + i + '/right-0'),
      right1: loadSprite('vehicles/vehicle-' + i + '/right-1'),
      left0: loadSprite('vehicles/vehicle-' + i + '/left-0'),
      left1: loadSprite('vehicles/vehicle-' + i + '/left-1')
    };
  }
  dimensions['vehicle-0'] = createDimension(945, 525);
  dimensions['vehicle-1'] = dimensions['vehicle-0'];
  dimensions['vehicle-2'] = dimensions['vehicle-0'];
  dimensions['vehicle-3'] = createDimension(1420, 620);
  dimensions['vehicle-4'] = dimensions['vehicle-3'];
  dimensions['vehicle-5'] = createDimension(570, 600);
  dimensions['vehicle-6'] = createDimension(1460, 1100);
  dimensions['vehicle-7'] = dimensions['vehicle-6'];
  dimensions['vehicle-8'] = dimensions['vehicle-6'];
  dimensions['vehicle-9'] = createDimension(920, 450);
  dimensions['vehicle-10'] = dimensions['vehicle-9'];
  Outrun.drawLoading();
  //\\//\\ HUD //\\//\\
  for(var i = 0; i < 10; i++){
    sprites['hud-'+i] = loadSprite('hud/digits/'+i);
  }
  sprites['hud-kmh'] = loadSprite('hud/kmh');
  sprites['hud-coconut-beach'] = loadSprite('hud/map/coconut-beach');
  sprites['hud-gateaway'] = loadSprite('hud/map/gateaway');
  sprites['hud-devils-canyon'] = loadSprite('hud/map/devils-canyon');
  sprites['hud-desert'] = loadSprite('hud/map/desert');
  sprites['hud-alps'] = loadSprite('hud/map/alps');
  sprites['hud-cloudy-mountain'] = loadSprite('hud/map/cloudy-mountain');
  sprites['hud-wilderness'] = loadSprite('hud/map/wilderness');
  sprites['hud-old-capital'] = loadSprite('hud/map/old-capital');
  sprites['hud-wheat-field'] = loadSprite('hud/map/wheat-field');
  sprites['hud-seaside-town'] = loadSprite('hud/map/seaside-town');
  sprites['hud-vineyard'] = loadSprite('hud/map/vineyard');
  sprites['hud-death-valley'] = loadSprite('hud/map/death-valley');
  sprites['hud-desolation-hill'] = loadSprite('hud/map/desolation-hill');
  sprites['hud-autobahn'] = loadSprite('hud/map/autobahn');
  sprites['hud-lakeside'] = loadSprite('hud/map/lakeside');
  //\\//\\ COLORS //\\//\\
  colors['coconut-beach'] = {
    skyColor: '#008BFF',
    darkOffroadColor: '#D3C0B2',
    lightOffroadColor: '#E1CDBF',
    darkAsphaltColor: '#7F7D7D',
    lightAsphaltColor: '#8B898A',
    darkSideColor: '#7F7D7D',
    lightSideColor: '#E5DCDD',
    darkLineColor: '#7F7D7D',
    lightLineColor: '#E5DCDD'
  };
  colors['gateaway'] = {
    skyColor: '#00BEDA',
    darkOffroadColor: '#959E6B',
    lightOffroadColor: '#A2AA75',
    darkAsphaltColor: '#767475',
    lightAsphaltColor: '#838081',
    darkSideColor: '#767475',
    lightSideColor: '#CECACD',
    darkLineColor: '#767475',
    lightLineColor: '#CECACD'
  };
  colors['devils-canyon'] = {
    skyColor: '#FFC25E',
    darkOffroadColor: '#809473',
    lightOffroadColor: '#8CA17F',
    darkAsphaltColor: '#89857A',
    lightAsphaltColor: '#9A958D',
    darkSideColor: '#8E0C00',
    lightSideColor: '#CAC6C7',
    darkLineColor: '#89857A',
    lightLineColor: '#CAC6C7'
  };
  colors['desert'] = {
    skyColor: '#000FFF',
    darkOffroadColor: '#CEBCA2',
    lightOffroadColor: '#DAC9AE',
    darkAsphaltColor: '#AB9C8F',
    lightAsphaltColor: '#B8A89B',
    darkSideColor: '#AB9C8F',
    lightSideColor: '#B8A89B',
    darkLineColor: '#AB9C8F',
    lightLineColor: '#B8A89B'
  };
  colors['alps'] = {
    skyColor: '#005AFF',
    darkOffroadColor: '#8BA17D',
    lightOffroadColor: '#95AC87',
    darkAsphaltColor: '#7E7C7E',
    lightAsphaltColor: '#8A878A',
    darkSideColor: '#7E7C7E',
    lightSideColor: '#C9C9C3',
    darkLineColor: '#7E7C7E',
    lightLineColor: '#C9C9C3'
  };
  colors['cloudy-mountain'] = {
    skyColor: '#938BFA',
    darkOffroadColor: '#959D6C',
    lightOffroadColor: '#A2AA75',
    darkAsphaltColor: '#777576',
    lightAsphaltColor: '#817F80',
    darkSideColor: '#777576',
    lightSideColor: '#C4C2C5',
    darkLineColor: '#777576',
    lightLineColor: '#C4C2C5'
  };
  colors['wilderness'] = {
    skyColor: '#D8C2A3',
    darkOffroadColor: '#B18F73',
    lightOffroadColor: '#BE9C7E',
    darkAsphaltColor: '#B8987B',
    lightAsphaltColor: '#C7A687',
    darkSideColor: '#B8987B',
    lightSideColor: '#C7A687',
    darkLineColor: '#B8987B',
    lightLineColor: '#C7A687'
  };
  colors['old-capital'] = {
    skyColor: '#7642FD',
    darkOffroadColor: '#523627',
    lightOffroadColor: '#5B3F2F',
    darkAsphaltColor: '#4E3F3F',
    lightAsphaltColor: '#574848',
    darkSideColor: '#4E3F3F',
    lightSideColor: '#C29E82',
    darkLineColor: '#4E3F3F',
    lightLineColor: '#C29E82'
  };
  colors['wheat-field'] = {
    skyColor: '#FFC25E',
    darkOffroadColor: '#825E00',
    lightOffroadColor: '#866404',
    darkAsphaltColor: '#646365',
    lightAsphaltColor: '#6F6E70',
    darkSideColor: '#646365',
    lightSideColor: '#C2C0C2',
    darkLineColor: '#646365',
    lightLineColor: '#C2C0C2'
  };
  colors['seaside-town'] = {
    skyColor: '#3C74FE',
    darkOffroadColor: '#D2A479',
    lightOffroadColor: '#DAAF82',
    darkAsphaltColor: '#868277',
    lightAsphaltColor: '#979288',
    darkSideColor: '#868277',
    lightSideColor: '#CDC9CE',
    darkLineColor: '#868277',
    lightLineColor: '#CDC9CE'
  };
  colors['vineyard'] = {
    skyColor: '#0BA1FF',
    darkOffroadColor: '#A3A95C',
    lightOffroadColor: '#B0B566',
    darkAsphaltColor: '#7F7D7E',
    lightAsphaltColor: '#898687',
    darkSideColor: '#7F7D7E',
    lightSideColor: '#ACAAAC',
    darkLineColor: '#7F7D7E',
    lightLineColor: '#ACAAAC'
  };
  colors['death-valley'] = {
    skyColor: '#6255FE',
    darkOffroadColor: '#AA7B5D',
    lightOffroadColor: '#AD7E5E',
    darkAsphaltColor: '#6C5D5D',
    lightAsphaltColor: '#776868',
    darkSideColor: '#6C5D5D',
    lightSideColor: '#C6C0C4',
    darkLineColor: '#6C5D5D',
    lightLineColor: '#C6C0C4'
  };
  colors['desolation-hill'] = {
    skyColor: '#EFECDC',
    darkOffroadColor: '#CEBEB1',
    lightOffroadColor: '#D9CABE',
    darkAsphaltColor: '#848284',
    lightAsphaltColor: '#908D90',
    darkSideColor: '#848284',
    lightSideColor: '#CFCCCF',
    darkLineColor: '#848284',
    lightLineColor: '#CFCCCF'
  };
  colors['autobahn'] = {
    skyColor: '#7642FD',
    darkOffroadColor: '#839876',
    lightOffroadColor: '#8EA481',
    darkAsphaltColor: '#696B86',
    lightAsphaltColor: '#747592',
    darkSideColor: '#8C0C00',
    lightSideColor: '#C5C4C5',
    darkLineColor: '#696B86',
    lightLineColor: '#C5C4C5'
  };
  colors['lakeside'] = {
    skyColor: '#FEAAA4',
    darkOffroadColor: '#B8A79B',
    lightOffroadColor: '#C6B4A8',
    darkAsphaltColor: '#7D7569',
    lightAsphaltColor: '#877F72',
    darkSideColor: '#7D7569',
    lightSideColor: '#C8C1C2',
    darkLineColor: '#7D7569',
    lightLineColor: '#C8C1C2'
  };
}

function loadSprite(fileName) {
  maxLoading++;
  var sprite = new Image();
  sprite.onload = function () {
    loading++;
  }
  sprite.src = "./assets/sprites/" + fileName + ".png";
  return sprite;
}

function loadSound(fileName) {
  maxLoading++;
  var sample = new Audio();
  sample.isLoaded = false;
  sample.oncanplay = function () {
    if (!this.isLoaded) {
      this.isLoaded = true;
      loading++;
    }
  }
  sample.src = "./assets/sounds/" + fileName + ".wav";
  return sample;
}

function createDimension(width, height, offset) {
  return { width: width, height: height, offset: offset };
}