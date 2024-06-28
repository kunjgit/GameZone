const STATE = {};

// -------- Values --------
class Resource{
  constructor({
    min = 0,
    max = 1,
    count = 0
  }={}){
    this.min = min;
    this.max = max;
    this.count = count;
  }
}

class Experience extends Resource{
  constructor(){
    super({
      max: -1,
      count: 0
    })
  }
}

class Concentration extends Resource{
  constructor(){
    super({
      max: 10,
      count: 10
    })
  }
}

class Energy extends Resource{
  constructor(){
    super({
      max: 10,
      count: 10
    })
  }
}

class Ideas extends Resource{
  constructor(){
    super({
      max: 10,
      count: 5
    })
  }
}

class Waste extends Resource{
  constructor(){
    super({
      max: 10,
      count: 0
    })
  }
}

class Fatigue extends Resource{
  constructor(){
    super({
      max: 10,
      count: 0
    })
  }
}

class Mood {
  constructor({
    ranges = {},
    emoji
  }={}){
    this.ranges = ranges;
    this.emoji = emoji;
  }
}

class Pain extends Mood {
  constructor(){
    super({
      emoji: '😖',
      ranges: {
        waste: [8, 10],
        energy: [0, 2]
      }
    });
  }
}

class Frustration extends Mood {
  constructor(){
    super({
      emoji: '😩',
      ranges: {
        energy: [2, 5],
        fatigue: [9, 10]
      }
    });
  }
}

class Restless extends Mood {
  constructor(){
    super({
      emoji: '😠',
      ranges: {
        waste: [6, 8],
        concentration: [0, 2]
      }
    });
  }
}

class Tired extends Mood {
  constructor(){
    super({
      emoji: '😔',
      ranges: {
        fatigue: [6, 9]
      }
    });
  }
}

class Sad extends Mood {
  constructor(){
    super({
      emoji: '😪',
      ranges: {
        ideas: [0, 2]
      }
    });
  }
}

class Ecstatic extends Mood {
  constructor(){
    super({
      emoji: '🥰',
      ranges: {
        waste: [0, 1],
        fatigue: [0, 1],
        ideas: [9, 10],
        energy: [9, 10]
      }
    });
  }
}

class Happy extends Mood {
  constructor(){
    super({
      emoji: '😊',
      ranges: {
        concentration: [5, 10],
        energy: [5, 10],
        fatigue: [0, 5],
        ideas: [5, 10],
        waste: [0, 5]
      }
    });
  }
}

const TIME_FACTOR = 5; // 1 second * X
// cost and gain are calculated per second
class Action{
  constructor({
    type,
    duration = 1000,
    cost = {},
    gain = {},
    start
  }={}){
    this.type = type;
    this.duration = duration;
    this.cost = cost;
    this.gain = gain;
    this.start = start ? new Date(start) : new Date();
  }
}

class Awake extends Action{
  constructor({start}={}){
    super({
      start,
      type: 'awake',
      duration: -1,
      cost: {
        energy: 1 / TIME_FACTOR
      },
      gain: {
        fatigue: 0.5 / TIME_FACTOR
      }
    });
  }
}
const SLEEP_DURATION = scaleTime(9, TIME_FACTOR); // seconds
class Sleep extends Action{
  constructor({start}={}){
    super({
      start,
      type: 'sleep',
      duration: SLEEP_DURATION * 1000,
      cost: {
        fatigue: 10 / SLEEP_DURATION,
        energy: 2 / SLEEP_DURATION
      },
      gain: {
        experience: 1000 / SLEEP_DURATION,
        concentration: 10 / SLEEP_DURATION
      }
    });
  }
}
const EAT_DURATION = scaleTime(2, TIME_FACTOR); // seconds
class Eat extends Action{
  constructor({start}={}){
    super({
      start,
      type: 'eat',
      duration: EAT_DURATION * 1000,
      cost: {
        concentration: 1 / EAT_DURATION
      },
      gain: {
        experience: 100 / EAT_DURATION,
        energy: 10 / EAT_DURATION,
        waste: 4.5 / EAT_DURATION
      }
    })
  }
}
const BATHROOM_DURATION = scaleTime(1.5, TIME_FACTOR); // seconds
class Bathroom extends Action{
  constructor({start}={}){
    super({
      start,
      type: 'bathroom',
      duration: BATHROOM_DURATION * 1000,
      cost: {
        concentration: 5 / BATHROOM_DURATION,
        waste: 10 / BATHROOM_DURATION
      },
      gain: {
        experience: 100 / BATHROOM_DURATION,
        ideas: 1 / BATHROOM_DURATION,
        fatigue: 1 / BATHROOM_DURATION,
      }
    });
  }
}
class Play extends Action{
  constructor({start}={}){
    super({
      start,
      type: 'play',
      duration: -1,
      cost: {
        energy: 1 / TIME_FACTOR,
        concentration: 1 / TIME_FACTOR
      },
      gain: {
        experience: 10 / TIME_FACTOR,
        experience: 5 / TIME_FACTOR,
        ideas: 1 / TIME_FACTOR
      }
    });
  }
}
class Create extends Action{
  constructor({start}={}){
    super({
      start,
      type: 'create',
      duration: -1,
      cost: {
        ideas: 1 / TIME_FACTOR,
        concentration: 1 / TIME_FACTOR
      },
      gain: {
        experience: 500 / TIME_FACTOR
      }
    });
  }
}
class Observe extends Action{
  constructor({start}={}){
    super({
      start,
      type: 'observe',
      duration: -1,
      cost: {
        ideas: 0.5 / TIME_FACTOR,
        fatigue: 0.5 / TIME_FACTOR
      },
      gain: {
        concentration: 1 / TIME_FACTOR,
        energy: 1.5 / TIME_FACTOR,
        experience: 250 / TIME_FACTOR
      }
    });
  }
}
class Creature{
  constructor(creature = {}){
    this.actions = creature.actions ? creature.actions.map(a => new actions[a.type](a)) : [];
    this.moods = creature.moods || {};
    this.mood = creature.mood || 'happy';
     resourceKeys.forEach(k => {
      this[k] = creature[k] && Object.assign({}, creature[k]) || new resources[k]()
    });
    moodKeys.forEach(k => this.moods[k] = creature.moods && creature.moods[k] || new moods[k]());
  }
}

class UI{
  constructor(ui = {}){
    this.stage = document.querySelector('.stage');
    this.editing = false;
    if(ui.editorOptionsSelectedIndex){
      this.editorOptionsSelectedIndex = ui.editorOptionsSelectedIndex;
    }else{
      this.editorOptionsSelectedIndex = {};
      editableOptionKeys.forEach(k => this.editorOptionsSelectedIndex[k] = -1);
    }

    this.editable = editableOptionKeys.map(k => {
      const btnAnimate = document.createElement('div');
      btnAnimate.classList.add('button-animate');
      const btn = document.createElement('div');
      btn.classList.add('button');
      if(editableOptions[k].icon){
        btn.appendChild(createSvgIcon(editableOptions[k].icon));
      }else{
        const circle = document.createElement('div');
        circle.classList.add('color-circle');
        btn.appendChild(circle);
      }
      btn.setAttribute('data-edit', k);
      btnAnimate.appendChild(btn);
      return btnAnimate;
    });
    this.actions = actionKeys.map(k => {
      const btnAnimate = document.createElement('div');
      btnAnimate.classList.add('button-animate');
      const btn = document.createElement('div');
      btn.classList.add('button');
      btnAnimate.classList.add('button-action--' + k);
      btn.appendChild(createSvgIcon(actionIconMap[k]));
      btnAnimate.setAttribute('data-action', k);
      btnAnimate.appendChild(btn);
      return btnAnimate;
    });
    this.resources = {};
    resourceKeys.forEach(k => {
      const p = document.createElement('progress');
      const d = document.createElement('div');
      const l = document.createElement('label');
      p.setAttribute('data-resource', k);
      p.setAttribute('id', k + 'Progress');
      l.setAttribute('for', k + 'Progress');
      l.textContent = k;
      d.appendChild(l);
      d.appendChild(p);
      d.classList.add('debug-stat');
      this.resources[k] = d;
    });
    this.debug = document.querySelector('.debug');
  }
  toJSON(){
    return {
      editorOptionsSelectedIndex: this.editorOptionsSelectedIndex
    }
  }
}

class Canvas{
  constructor(svgData){
    this.svgData = svgData;
  }
  toJSON(){
    return {};
  }
}

class Game{
  constructor({
    playing = true
  } = {}){
    this.playing = playing;
  }
}

const resources = {
  'concentration': Concentration,
  'energy': Energy,
  'experience': Experience,
  'fatigue': Fatigue,
  'ideas': Ideas,
  'waste': Waste
};

const resourceKeys = Object.keys(resources);

const actions = {
  'awake': Awake,
  'sleep': Sleep,
  'bathroom': Bathroom,
  'create': Create,
  'eat': Eat,
  'observe': Observe,
  'play': Play
};

const emojiAction = {
  'awake': '',
  'bathroom': '🚽',
  'create': '🖍️',
  'eat': '🍌',
  'play': '🧸',
  'sleep': '💤',
  'observe': '🔭'
};

const actionKeys = [
  'awake',
  'sleep',
  'bathroom',
  'eat',
  'play',
  'create',
  'observe'
];

const actionIconMap = {
  'awake': 'symbol-sun-icon',
  'bathroom': 'symbol-fart-cloud-icon',
  'create': 'symbol-yarn-ball-icon',
  'eat': 'symbol-cookie-icon',
  'observe': 'symbol-mug-icon',
  'play': 'symbol-ping-pong-icon',
  'sleep': 'symbol-moon-icon'
};

const wakingActions = [
  Eat,
  Bathroom,
  Create,
  Play,
  Observe
];

const moods = {
  'pain': Pain,
  'frustration': Frustration,
  'restless': Restless,
  'tired': Tired,
  'sad': Sad,
  'happy': Happy,
  'ecstatic': Ecstatic
};

const moodKeys = [
  'pain',
  'frustration',
  'restless',
  'tired',
  'sad',
  'ecstatic',
  'happy'
];

const editableOptions = {
  earType: {
    icon: 'symbol-ears-icon',
    options: [
      'ears--small',
      'ears--medium',
      'ears--big'
    ]
  },
  furType: {
    icon: 'symbol-fur-icon',
    options: [
      'body--fur',
      'face--fur',
      ['body--fur', 'face--fur']
    ]
  },
  noseType: {
    icon: 'symbol-nose-icon',
    options: [
      'nose--triangle',
      'nose--round'
    ]
  },
  furColor: {
    options: [
      'fur--white',
      'fur--green'
    ]
  },
  faceColor: {
    options: [
      'face--white',
      'face--green'
    ]
  }
};

const rigModifiers = {
  happy: {
    full: ['idle'],
    face: ['happy']
  },
  pain: {
    full: ['idle'],
    face: ['pain']
  },
  frustration: {
    full: ['idle'],
    face: ['frustration']
  },
  tired: {
    full: ['idle'],
    face: ['tired']
  },
  restless: {
    full: ['restless', 'idle'],
    face: ['restless']
  },
  sad: {
    full: ['idle'],
    face: ['sad']
  },
  ecstatic: {
    full: ['ecstatic', 'idle'],
    face: ['ecstatic']
  },
  sleep: {
    full: ['sleep', 'idle'],
    face: ['sleep']
  },
  bathroom: {
    full: ['bathroom'],
    face: ['bathroom']
  },
  eat: {
    full: ['eat'],
    face: ['eat']
  },
  play: {
    full: ['play', 'idle'],
    face: ['play']
  },
  create: {
    full: ['create'],
    face: ['create']
  },
  observe: {
    full: ['relax', 'idle'],
    face: ['relax']
  }
};

const editableOptionKeys = Object.keys(editableOptions);

const soundElement = document.getElementById('buttonSound');
let stopTime = 1;

soundElement.addEventListener('timeupdate', ()=>{
  if(soundElement.currentTime >= stopTime){
    soundElement.pause();
  }
}, false);

const sounds = {
  button: [0.9, 2]
};

// -------- Policies --------
function isSleeping(state){
  return state.creature.actions.some(a => a instanceof Sleep);
}

function isAwake(state){
  return state.creature.actions.some(a => a instanceof Awake);
}

function canConcentrate(state, diff){
  diff = diff || calculateResources(state).diff;
  return diff.concentration.count > diff.concentration.min;
}

function isFatigued(state, diff){
  diff = diff || calculateResources(state).diff;
  return diff.fatigue.count >= diff.fatigue.max;
}

function hasFatigue(state, diff){
  diff = diff || calculateResources(state).diff;
  return diff.fatigue.count >= diff.fatigue.min;
}

function hasEnergy(state, diff){
  diff = diff || calculateResources(state).diff;
  return diff.energy.count > diff.energy.min;
}

function hasIdeas(state, diff){
  diff = diff || calculateResources(state).diff;
  return diff.ideas.count > diff.ideas.min;
}

function canSleep(state){
  const diff = calculateResources(state).diff;
  return isAwake(state) && (hasFatigue(state, diff) || needsConcentration(state, diff));
}

function canEat(state){
  const diff = calculateResources(state).diff;
  return isAwake(state) && !isFatigued(state, diff) && canConcentrate(state, diff) && diff.energy.count < diff.energy.max;
}

function canBathroom(state){
  const diff = calculateResources(state).diff;
  return isAwake(state) && !isFatigued(state, diff) && canConcentrate(state, diff) && diff.waste.count > diff.waste.min;
}

function canPlay(state){
  const diff = calculateResources(state).diff;
  return isAwake(state) && canConcentrate(state, diff) && hasEnergy(state, diff) && diff.ideas.count < diff.ideas.max;
}

function canCreate(state){
  const diff = calculateResources(state).diff;
  return isAwake(state) && canConcentrate(state, diff) && hasIdeas(state, diff);
}

function needsConcentration(state, diff){
  diff = diff || calculateResources(state).diff;
  return diff.concentration.count < diff.concentration.max;
}

function canObserve(state){
  const diff = calculateResources(state).diff;
  return isAwake(state) && needsConcentration(state, diff) && hasIdeas(state, diff);
}

function isPerformingWaking(state){
  return state.creature.actions.some(a => wakingActions.some(p => a instanceof p));
}

function isPerforming(state, action){
  return state.creature.actions.some(a => a instanceof actions[action]);
}

function isPerformingAction(state){
  return !!state.creature.actions.length;
}

function canPerformAction(state, action){
  if(action === 'awake'){
    return isSleeping(state) || !state.creature.actions.length;
  }
  if(action === 'sleep'){
    return canSleep(state);
  }
  if(action === 'eat'){
    return canEat(state);
  }
  if(action === 'bathroom'){
    return canBathroom(state);
  }
  if(action === 'play'){
    return canPlay(state);
  }
  if(action === 'create'){
    return canCreate(state);
  }
  if(action === 'observe'){
    return canObserve(state);
  }
  return true;
}

function canCompleteAction(state, action){
  const checkDate = new Date();
  if(action.duration !== -1){
    if(checkDate - action.start >= action.duration){
      return true;
    }
  }
  if(action instanceof Eat){
    return !canEat(state);
  }
  if(action instanceof Bathroom){
    return !canBathroom(state);
  }
  if(action instanceof Play){
    return !canPlay(state);
  }
  if(action instanceof Create){
    return !canCreate(state);
  }
  if(action instanceof Observe){
    return !canObserve(state);
  }
  return false;
}

function isDebug(w){
  return w.location.search.indexOf('debug') !== -1
}

// -------- Services ---------
function init(state){
  state.creature = new Creature(state.creature);
  state.game = new Game(state.game);
  state.ui = new UI(state.ui);
  state.canvas = new Canvas();
  state.sound = true;
  initCanvas(state);
  initUI(state);
  initGame(state);
  initCreature(state);
}

function initCreature(state){
  checkRigModifiers(state);
}

function initCanvas(state){
  unpack(state);
}

function initUI(state){
  if(isDebug(window)){
    resourceKeys.forEach(k => {
      const p = state.ui.resources[k].querySelector('progress');
      p.value = state.creature[k].count;
      p.setAttribute('max', state.creature[k].max === -1 ? 100000 : state.creature[k].max);
      state.ui.debug.appendChild(state.ui.resources[k])
    });
    state.ui.debug.classList.remove('hide');
  }
  state.ui.gameActions = document.querySelector('.game');
  state.ui.editorActions = document.querySelector('.editor');
  state.ui.actionsContainer = document.querySelector('.actions');
  state.ui.actions.forEach(b => {
    buttonClick(state, b, n => actionOnClick(state, n));
    state.ui.gameActions.appendChild(b);
  });
  state.ui.editable.forEach(b => {
    buttonClick(state, b, n => changeSelectedEditorOption(state, n.querySelector('.button').getAttribute('data-edit')));
    state.ui.editorActions.appendChild(b);
  });
  touchClick(state.canvas.target);
  state.canvas.target.addEventListener('click', evt => {
    state.ui.editing = !state.ui.editing;
    updateUI(state);
  });
  editableOptionKeys.forEach(k => toggleEditableClasses(state, k, -1));
  state.score = document.querySelector('.score');
  const span = document.createElement('span');
  state.scoreValue = span;
  state.score.appendChild(span);
  state.score.appendChild(createSvgIcon('symbol-star-icon'));
}

function changeSelectedEditorOption(state, editableOption){
  const previousIndex = state.ui.editorOptionsSelectedIndex[editableOption];
  if(previousIndex === -1){
    state.ui.editorOptionsSelectedIndex[editableOption] = 0;
  }else{
    if(previousIndex === editableOptions[editableOption].options.length - 1){
      state.ui.editorOptionsSelectedIndex[editableOption] = -1;
    }else{
      state.ui.editorOptionsSelectedIndex[editableOption] = state.ui.editorOptionsSelectedIndex[editableOption] + 1;
    }
  }
  toggleEditableClasses(state, editableOption, previousIndex);
  saveState(state);
}

function toggleEditableClasses(state, editableOption, prev){
  requestAnimationFrame(()=>{
    let i = state.ui.editorOptionsSelectedIndex[editableOption];
    if(prev !== -1){
      if(Array.isArray(editableOptions[editableOption].options[prev])){
        editableOptions[editableOption].options[prev].forEach(c => state.ui.stage.classList.remove(c));
      }else{
        state.ui.stage.classList.remove(editableOptions[editableOption].options[prev]);
      }
    }
    if(i !== -1){
      if(Array.isArray(editableOptions[editableOption].options[i])){
        editableOptions[editableOption].options[i].forEach(c => state.ui.stage.classList.add(c));
      }else{
        state.ui.stage.classList.add(editableOptions[editableOption].options[i]);
      }
    }
  });
}

function updateUI(state){
  const diff = calculateResources(state).diff;
  resourceKeys.forEach(k => {
    state.ui.resources[k].querySelector('progress').value = diff[k].count;
  });
  const mood = getMood(state, diff);
  if(!state.mood || state.mood.name !== mood.name){
    state.mood = mood;
  }
  state.ui.actions.forEach(a => {
    const action = a.getAttribute('data-action');
    a.classList.toggle('performing', isPerforming(state, action));
  });
  if(state.ui.editing && !state.ui.actionsContainer.classList.contains('actions--editing')){
    state.ui.actionsContainer.classList.add('actions--editing');
  }
  if(!state.ui.editing && state.ui.actionsContainer.classList.contains('actions--editing')){
    state.ui.actionsContainer.classList.remove('actions--editing');
  }
  if(isAwake(state)){
    if(!state.ui.actions[0].classList.contains('hide')){
      state.ui.actions[0].classList.add('hide');
    }
    if(state.ui.actions[1].classList.contains('hide')){
      state.ui.actions[1].classList.remove('hide');
    }
  }else{
    if(state.ui.actions[0].classList.contains('hide')){
      state.ui.actions[0].classList.remove('hide');
    }
    if(!state.ui.actions[1].classList.contains('hide')){
      state.ui.actions[1].classList.add('hide');
    }
  }
  let score = Math.ceil(diff.experience.count / 1000);
  if(score != state.scoreValue.textContent){
    state.scoreValue.textContent = score;
  }
  if(isDebug(window)){
    resourceKeys.forEach(k => {
      const p = state.ui.resources[k].querySelector('progress');
      p.value = diff[k].count;
    });
  }
}

function initGame(state){
  if(!state.game.playing){
    state.game.playing = true;
  }
  if(!state.creature.actions.length){
    performAction(state, 'awake');
  }
  gameTick(state);
}

function debounceTick(fn){
  requestAnimationFrame(fn);
}

let saveTimeout;
function debounceSave(state){
  if(saveTimeout) return;
  saveTimeout = setTimeout(()=>{
    saveState(state);
    saveTimeout = null;
  }, 5000);
}

function gameTick(state){
  stateChange(state);
  if(state.game.playing){
    debounceTick(() => gameTick(state));
  }
}

function stateChange(state){
  checkActions(state);
  checkMood(state);
  updateUI(state);
  debounceSave(state);
}

function checkMood(state){
  const calc = calculateResources(state);
  const diff = calc.diff;
  const mood = getMood(state, diff);
  if(state.creature.mood === mood.name){
    return;
  }
  moodChange(state, state.creature.mood, mood.name);
}

function moodChange(state, previousMood, mood){
  state.creature.mood = mood;
  checkRigModifiers(state);
}

function getPerformingAction(state){
  return state.creature.actions.reduce((prev, curr)=>{
    if(wakingActions.some(p => curr instanceof p)){
      return curr;
    }
    if(curr instanceof Sleep){
      return curr;
    }
    return prev;
  });
}

function checkRigModifiers(state){
  const modifiers = [];
  const replace = {};
  modifiers.push(rigModifiers[state.creature.mood]);
  if(isPerformingAction(state)){
    modifiers.push(rigModifiers[getPerformingAction(state).type]);
  }
  modifiers.forEach(m => {
    Object.assign(replace, m);
  });
  replaceRigModifiers(state, replace);
}

function getRigModifiers(element){
  return Array.prototype.slice.call(element.classList)
    .filter(c => c.indexOf('rig--') === 0)
    .map(c => c.replace('rig--', ''));
}

function replaceRigModifiers(state, replace){
  Object.keys(replace).forEach(k => {
    const element = state.canvas.target.querySelector(`.rig-${k}`);
    const currentRigModifiers = getRigModifiers(element);

    currentRigModifiers.forEach(c => {
      if(replace[k].indexOf(c) === -1){
        element.classList.remove(`rig--${c}`);
      }
    });
    replace[k].forEach(c => element.classList.add(`rig--${c}`));
  });
}

function checkActions(state){
  state.creature.actions.slice().forEach(a => {
    if(canCompleteAction(state, a)){
      if(a instanceof Sleep){
        performAction(state, 'awake');
        return;
      }
      if(a instanceof Awake){
        performAction(state, 'sleep');
        return;
      }
      completeAction(state, a);
    }
  });
}

function performAction(state, action){
  if(action === 'awake' && isPerformingAction(state)){
    // completeSleepingActions(state)
    completeAction(state, state.creature.actions.find(a => a instanceof Sleep));
  }
  if(action === 'sleep'){
    completeAction(state, state.creature.actions.find(a => a instanceof Awake));
  }
  completeWakingActions(state);
  state.creature.actions.push(new actions[action]());
  checkRigModifiers(state);
}

function completeWakingActions(state){
  state.creature.actions.forEach(a => {
    if(wakingActions.some(p => a instanceof p)){
      completeAction(state, a);
    }
  });
}

function completeAction(state, action){
  const calc = calculateResources(state);
  const diff = calc.diff;
  const actionType = actionKeys.find(k => action instanceof actions[k]);
  updateResources(state, diff);
  state.creature.actions.splice(state.creature.actions.indexOf(action), 1);
  state.creature.actions.forEach(a => {
    const elapsedSeconds = calc.calcTime - a.start;
    a.start = new Date();
    if(a.duration !== -1){
      a.duration = a.duration - elapsedSeconds;
      if(a.duration < 0){
        a.duration = 0;
      }
    }
  });
  checkRigModifiers(state);
}

function actionOnClick(state, node){
  const action = node.getAttribute('data-action');
  if(canPerformAction(state, action)){
    performAction(state, action); //performing action completes actions if necesary
  }else{
    shakeHead(state);
  }
}

function shakeHead(state){
  const full = state.canvas.target.querySelector('.rig-full');
  full.addEventListener('animationend', ()=>{
    requestAnimationFrame(()=>{
      full.classList.remove('rig--shake');
    });
  }, {once: true});
  requestAnimationFrame(()=>{
    full.classList.add('rig--shake');
    // playSound(state, 'shake');
  });
}

function playSound(state, sound){
  if(state.sound){
    soundElement.currentTime = sounds[sound][0];
    stopTime = sounds[sound][1];
    soundElement.play();
  }
}

function calculateResources(state){
  const diff = new Creature(state.creature);
  const calcTime = new Date();
  state.creature.actions.forEach(a => {
    const elapsedSeconds = Math.min((calcTime - a.start) / 1000);
    Object.keys(a.cost).forEach( r => {
      const val = diff[r].count - (a.cost[r] * elapsedSeconds);
      diff[r].count = val < state.creature[r].min ? state.creature[r].min : val;
    });
    Object.keys(a.gain).forEach( r => {
      const val = diff[r].count + (a.gain[r] * elapsedSeconds);
      diff[r].count = val > state.creature[r].max && state.creature[r].max !== -1 ? state.creature[r].max : val;
    });
  });
  return {
    diff,
    calcTime
  };
}

function updateResources(state, diff){
  resourceKeys.forEach(k => {
    state.creature[k].count = diff[k].count;
  });
}

function getMood(state, diff){
  const activeMoods = moodKeys
    .map(k => {
      let mood;
      let reason;
      Object.keys(state.creature.moods[k].ranges)
        .some(r => {
          if(rangeContains(state.creature.moods[k].ranges[r], diff[r].count)){
            mood = state.creature.moods[k];
            reason = r;
            return true;
          }
        });
      if(mood){
       return {
         mood,
         reason,
         name: k
       }
      }
      return null;
    })
    .filter(m => m !== null)
  if(activeMoods.length){
    return activeMoods[0];
  }
  return {
    name: 'default',
    mood: {
      emoji: '🤪🤔😃'
    },
    reason: 'no other match'
  };
}

function rangeContains(r, n){
  return n >= r[0] && n <= r[1];
}

function scaleTime(seconds, factor){
  return seconds * factor;
}

function unpack(state){
  const svg = document.querySelector('svg');
  const canvas = document.querySelector('.canvas');
  state.canvas.svg = svg;
  state.canvas.target = canvas;
  state.canvas.viewBox = window.SVG_DATA.viewBox;
  window.SVG_DATA.data.forEach(d => unpackSVG(state, d));
}

function unpackSVG(state, data){
  let target = state.canvas.target;
  if(data.type === 'rig'){
    const element = document.createElement('div');
    element.classList.add('rig');
    element.classList.add(`rig-${data.name}`);
    if(data.name !== 'icons'){
      target.appendChild(element);
    }
    let t = element;
    data.armatures.forEach(a => {
      const div = document.createElement('div');
      div.classList.add('armature', `armature-${data.name}`, `armature-${a}`);
      t.appendChild(div);
      t = div;
    });
    state.canvas.target = t;
    data.children.forEach(child => unpackSVG(state, child));
    state.canvas.target = target;
  }else{
    data.armatures.forEach(a => {
      const div = document.createElement('div');
      div.classList.add('armature', `armature-${data.name}`, `armature-${a}`);
      target.appendChild(div);
      target = div;
    });
    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    if(data.name.indexOf('icon') !== -1){
      symbol.setAttribute('id', `symbol-${data.name}`);
      symbol.setAttribute('viewBox', '0 0 64 64');
      symbol.innerHTML = data.svg;
      state.canvas.svg.appendChild(symbol);
      return;
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', `svg-${data.name}`);
    svg.setAttribute('viewBox', state.canvas.viewBox);
    svg.classList.add(`svg-${data.name}`);
    // const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    // svg.classList.add(`symbol-${data.name}`); //for fill color
    // use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#symbol-${data.name}`);
    // svg.appendChild(use);
    svg.innerHTML = data.svg;

    target.appendChild(svg);
  }
}

function buttonClick(state, node, handler){
  touchClick(node);
  node.addEventListener('click', evt => {
    playSound(state, 'button');
    handler(node);
    requestAnimationFrame(()=>{
      node.classList.add('active');
    });
    node.addEventListener('animationiteration', ()=>{
      requestAnimationFrame(()=>{
        node.classList.remove('active');
      });
    }, {once: true});
  });
}

function touchClick(node){
  if(node.touchClick) return;
  const data = {
    startX: 0,
    startY: 0,
    moved: false
  };
  node.addEventListener('touchstart', (evt)=>{
    if(evt.touches.length > 1) return;
    data.startX = evt.touches[0].pageX;
    data.startY = evt.touches[0].pageY;
  }, {passive: true});
  node.addEventListener('touchmove', (evt)=>{
    if(data.moved || evt.touches.length > 1) return;
    if(Math.abs(evt.touches[0].pageX - data.startX) > TOUCH_PADDING || Math.abs(evt.touches[0].pageY - data.startY) > TOUCH_PADDING){
      data.moved = true;
    }
  }, {passive: true});
  node.addEventListener('touchend', (evt)=>{
    evt.preventDefault();
    if(evt.touches.length > 1) return;
    if(!data.moved && node.contains(evt.target)){
      node.focus(); // to hide keyboard?
      dispatchClick(node, evt);
    }
    data.startX = 0;
    data.startY = 0;
    data.moved = false;
  });
}

function dispatchClick(node, evt){
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  event.origin = evt;
  node.dispatchEvent(event);
}

function createSvgIcon(name){
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add(`symbol-icon-${name}`);
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${name}`);
  svg.appendChild(use);
  return svg;
}

function getState(state){
  return Object.assign({}, state, JSON.parse(localStorage.getItem('state') || '{}'));
}

function saveState(state){
  localStorage.setItem('state', JSON.stringify(state));
}

init(getState(STATE));
