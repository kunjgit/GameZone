

function init(state){
  renderRigs(state, document.querySelector('.canvas'));
}

function renderRigs(rigs, target){
    rigs.forEach(r => renderRig(r, r.name, target));
}

function renderRig(rig, name, target){
  const element = document.createElement('div');
  element.classList.add('rig');
  element.classList.add(`rig-${name}`);
  if(target){
    target.appendChild(element);
  }
  target = element;
  if(rig.armatures){
    rig.armatures.forEach(a => {
      const div = document.createElement('div');
      div.classList.add('armature');
      div.classList.add(`armature-${a}`);
      target.appendChild(div);
      target = div;
    });
  }
  if(rig.symbol){
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#symbol-${name}`);
    svg.appendChild(use);
    target.appendChild(svg);
  }
  rig.element = element;
  rig.rigs && renderRigs(rig.rigs, target);
}

function unpack(){
  const svg = document.querySelector('svg');
  const canvas = document.querySelector('.canvas');
  window.svgData.data.forEach(d => unpackSVG(d, {svg, canvas, target: canvas}))
}

function unpackSVG(data, state){
  let target = state.target;
  if(data.type === 'rig'){
    const element = document.createElement('div');
    element.classList.add('rig');
    element.classList.add(`rig-${data.name}`);
    target.appendChild(element);
    let t = element;
    data.armatures.forEach(a => {
      const div = document.createElement('div');
      div.classList.add('armature', `armature-${data.name}`, `armature-${a}`);
      t.appendChild(div);
      t = div;
    });
    state.target = t;
    data.children.forEach(child => unpackSVG(child, state));
    state.target = target;
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
    }else{
      symbol.setAttribute('id', `symbol-${data.name}`);
      symbol.setAttribute('viewBox', window.svgData.viewBox);
    }

    symbol.innerHTML = data.svg;
    state.svg.appendChild(symbol);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.classList.add(`symbol-${name}`); //for fill color
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#symbol-${data.name}`);
    svg.appendChild(use);
    target.appendChild(svg);
  }
}

const controls = [
  'sleep',
  'awake',
  'eat',
  'bathroom',
  'play',
  'relax',
  'create'
];
let activeControl = 0;
function createControls(){
  const rows = Array.prototype.slice.call(document.querySelectorAll('.row'));
  controls.forEach((c,i)=> {
    const ctrl = document.createElement('div');
    ctrl.classList.add('ctrl-btn', `ctrl-btn--${c}`);
    if(i === activeControl){
      document.querySelector('.rig-full').classList.add(`rig--${c}`);
      ctrl.classList.add('active');
    }
    ctrl.addEventListener('click', ()=>{
      document.querySelector('.rig-full').classList.remove(`rig--${controls[activeControl]}`);
      document.querySelector('.rig-full').classList.add(`rig--${c}`);
      document.querySelector('.active').classList.remove('active');
      ctrl.classList.add('active');
      activeControl = controls.indexOf(c);
    });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.classList.add(`btn-symbol-${c}`);
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#symbol-${c}-icon`);
    svg.appendChild(use);
    ctrl.appendChild(svg);
    rows[i < 4 ? 0 : 1].appendChild(ctrl);
  });
}

unpack();
createControls();

document.querySelector('.rig-full').classList.add('rig--idle');
// document.querySelector('.rig-face').classList.add('rig--play');
