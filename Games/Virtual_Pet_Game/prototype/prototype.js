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
    duration = 1000,
    cost = {},
    gain = {},
    start
  }={}){
    this.duration = duration;
    this.cost = cost;
    this.gain = gain;
    this.start = start || new Date();
  }
}

class Awake extends Action{
  constructor(){
    super({
      duration: -1,
      cost: {
        energy: 1 / TIME_FACTOR
      },
      gain: {
        experience: 1 / TIME_FACTOR,
        fatigue: 0.5 / TIME_FACTOR
      }
    });
  }
}
const SLEEP_DURATION = scaleTime(9, TIME_FACTOR); // seconds
class Sleep extends Action{
  constructor(){
    super({
      duration: SLEEP_DURATION * 1000,
      cost: {
        fatigue: 10 / SLEEP_DURATION,
        energy: 2 / SLEEP_DURATION
      },
      gain: {
        concentration: 10 / SLEEP_DURATION
      }
    });
  }
}
const EAT_DURATION = scaleTime(2, TIME_FACTOR); // seconds
class Eat extends Action{
  constructor(){
    super({
      duration: EAT_DURATION * 1000,
      cost: {
        concentration: 1 / EAT_DURATION
      },
      gain: {
        energy: 10 / EAT_DURATION,
        waste: 4.5 / EAT_DURATION
      }
    })
  }
}
const BATHROOM_DURATION = scaleTime(1.5, TIME_FACTOR); // seconds
class Bathroom extends Action{
  constructor(){
    super({
      duration: BATHROOM_DURATION * 1000,
      cost: {
        concentration: 5 / BATHROOM_DURATION,
        waste: 10 / BATHROOM_DURATION
      },
      gain: {
        ideas: 1 / BATHROOM_DURATION,
        fatigue: 1 / BATHROOM_DURATION,
      }
    });
  }
}
class Play extends Action{
  constructor(){
    super({
      duration: -1,
      cost: {
        energy: 1 / TIME_FACTOR,
        concentration: 1 / TIME_FACTOR
      },
      gain: {
        experience: 5 / TIME_FACTOR,
        ideas: 1 / TIME_FACTOR
      }
    });
  }
}
class Create extends Action{
  constructor(){
    super({
      duration: -1,
      cost: {
        ideas: 1 / TIME_FACTOR,
        concentration: 1 / TIME_FACTOR
      },
      gain: {
        experience: 50 / TIME_FACTOR
      }
    });
  }
}
class Observe extends Action{
  constructor(){
    super({
      duration: -1,
      cost: {
        ideas: 0.5 / TIME_FACTOR
      },
      gain: {
        concentration: 1 / TIME_FACTOR,
        energy: 1.5 / TIME_FACTOR
      }
    });
  }
}
class Creature{
  constructor(creature = {}){
    this.actions = [];
    this.moods = {};
    resourceKeys.forEach(k => this[k] = creature[k] && Object.assign({}, creature[k]) || new resources[k]());
    moodKeys.forEach(k => this.moods[k] = creature.moods && creature.moods[k] || new moods[k]());
  }
}

class UI{
  constructor(state){
    this.actions = actionKeys.map(k => {
      const btn = document.createElement('button');
      btn.textContent = k;
      btn.setAttribute('data-action', k);
      return btn;
    });
    this.resources = {};
    resourceKeys.forEach(k => {
      const p = document.createElement('progress');
      const d = document.createElement('div');
      const l = document.createElement('label');
      p.setAttribute('max', state.creature[k].max === -1 ? 1000 : state.creature[k].max);
      p.setAttribute('data-resource', k);
      p.setAttribute('id', k);
      l.setAttribute('for', k);
      l.textContent = k;
      p.value = state.creature[k].count;
      d.appendChild(l);
      d.appendChild(p);
      this.resources[k] = d;
    });
    const pauseBtn = document.createElement('button');
    pauseBtn.textContent = 'pause';
    this.pauseBtn = pauseBtn;

    const playBtn = document.createElement('button');
    playBtn.textContent = 'play';
    this.playBtn = playBtn;

    const mood = document.createElement('div');
    mood.classList.add('emoji');
    this.mood = mood;

    const action = document.createElement('div');
    action.classList.add('emoji');
    action.classList.add('emoji-action');
    this.action = action;
  }
}

class Game{
  constructor(){
    this.playing = false;
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
  'bathroom': Bathroom,
  'create': Create,
  'eat': Eat,
  'observe': Observe,
  'play': Play,
  'sleep': Sleep
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

const actionKeys = Object.keys(actions);

const wakingActions = [
  Eat,
  Bathroom,
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

function hasEnergy(state, diff){
  diff = diff || calculateResources(state).diff;
  return diff.energy.count > diff.energy.min;
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
  return isAwake(state) && canConcentrate(state, diff) && diff.ideas.count > diff.ideas.min;
}

function canObserve(state){
  const diff = calculateResources(state).diff;
  return isAwake(state) && diff.concentration.count < diff.concentration.max && diff.ideas.count > diff.ideas.min;
}

function isPerformingWaking(state){
  return state.creature.actions.some(a => wakingActions.some(p => a instanceof p));
}

function isPerforming(state, action){
  return state.creature.actions.some( a => a instanceof actions[action]);
}

function canPerformAction(state, action){
  if(action === 'awake'){
    return isSleeping(state) || !state.creature.actions.length;
  }
  if(action === 'sleep'){
    return isAwake(state);
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

// -------- Services ---------
function init(state){
  state.creature = new Creature();
  state.ui = new UI(state);
  state.game = new Game();
  state.ui.actions.forEach(a => {
    document.body.appendChild(a);
    a.addEventListener('click', evt => actionOnClick(state, evt))
  });
  resourceKeys.forEach(k => {
    document.body.appendChild(state.ui.resources[k]);
  });
  state.ui.pauseBtn.addEventListener('click', evt => state.game.playing = false);
  state.ui.playBtn.addEventListener('click', evt => {
    state.game.playing = true;
    gameTick(state);
  });
  document.body.appendChild(state.ui.playBtn);
  document.body.appendChild(state.ui.pauseBtn);
  document.body.appendChild(state.ui.mood);
  document.body.appendChild(state.ui.action);
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
  state.ui.action.classList.add('hide');
  state.ui.actions.forEach(a => {
    const action = a.getAttribute('data-action');
    a.classList.toggle('active', isPerforming(state, action));
    if(isPerforming(state, action) && action !== 'awake'){
      if(state.ui.action.textContent !== emojiAction[action]){
        state.ui.action.textContent = `${emojiAction[action]}`;
      }
      state.ui.action.classList.remove('hide');
    }
  });
//   state.ui.mood.textContent = `${mood.mood.emoji} : ${mood.name} : ${mood.reason}`;
  state.ui.mood.textContent = `${mood.mood.emoji}`;
}

function gameTick(state){
  checkActions(state);
  updateUI(state);
  if(state.game.playing){
    requestAnimationFrame(() => gameTick(state));
  }
}

function completeWakingActions(state){
  state.creature.actions.forEach(a => {
    if(wakingActions.some(p => a instanceof p)){
      completeAction(state, a);
    }
  })
}

function performAction(state, action){
  if(action === 'awake' && !!state.creature.actions.length){
    // completeSleepingActions(state)
    completeAction(state, state.creature.actions.find(a => a instanceof Sleep));
  }
  if(action === 'sleep'){
    completeWakingActions(state);
    completeAction(state, state.creature.actions.find(a => a instanceof Awake));
  }
  if(action === 'eat' || action === 'bathroom' || action === 'play' || action === 'observe'){
    completeWakingActions(state);
  }
  state.creature.actions.push(new actions[action]());
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

function completeAction(state, action){
  const calc = calculateResources(state);
  const diff = calc.diff;
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
}

function actionOnClick(state, evt){
  const action = evt.currentTarget.getAttribute('data-action');
  if(isPerforming(state, action) && (action === 'play' || action === 'eat' || action === 'create' || action === 'observe')){
    completeAction(state, state.creature.actions.find(a => a instanceof actions[action]));
    return;
  }
  if(canPerformAction(state, action)){
    performAction(state, action);
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

init(STATE);
