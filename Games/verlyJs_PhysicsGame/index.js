window.onload = function () {
  let examples = [
    { title: 'Behavior', src: './examples/behavior.html' },
    { title: 'Multiple Behavior', src: './examples/behavior2.html' },
    { title: 'Fluid Gyroscope', src: './examples/fluidGyroscope.html' },
    { title: 'Dynamic Mesh (right click)', src: './examples/dynamicCustomMesh.html' },
    { title: 'Ragdoll', src: './examples/ragdoll.html' },
    { title: 'Shaded Cloth', src: './examples/shadedCloth.html' },
    { title: 'Typography', src: './examples/typography/index.html' },
    { title: 'Custom Entity', src: './examples/joinEntities.html' },
    { title: 'Ship', src: './examples/ship/index.html' },
  ];


  const dom_ui = document.querySelector('.examples-container');
  const frame = document.getElementById('frame');

  frame.src = examples[0].src;
  if (window.location.hash) {
    frame.src = window.location.hash.replace('#', '');
  }
  var content = frame.contentWindow.document.body;

  content.style.padding = 0;
  content.style.margin = 0;
  for (let i = 0; i < examples.length; i++) {
    let button = document.createElement('button');
    button.innerHTML = examples[i].title;
    button.dataset.src = examples[i].src;
    button.onclick = function (e) {
      frame.src = button.dataset.src;
      window.location.hash = button.dataset.src;
    }
    dom_ui.appendChild(button);
  }
}








// CAN BE USED FOR DOCS
// let width = 400;
// let height = 300;
// window.onload = function () {
//   const DOMWrapper = document.querySelector('.cards-container');

//   let cards = {
//     Box: [width / 2 - 50, 150, 100, 100],
//     Cloth: [width / 2, 150, 200, 200, 15, 7],
//     Rope: [width / 2, 20, 20, 10, 0],
//     Hexagon: [width / 2, 150, 18, 60, 2, 13],
//     Ragdoll: [width / 2, 0]
//   }

//   let domStr = '';
//   for (const card in cards) {
//     domStr += `
//       <div class="card">
//         <h3>verly.create${card}()</h3>
//         <hr />
//         <canvas id="canvas-${card.toLowerCase()}"></canvas>
//       </div>
//     `
//   }
//   DOMWrapper.innerHTML = domStr;
//   for (const card in cards) {
//     initCardVerly(card.toLowerCase(), cards[card])
//   }

// }
// function initCardVerly(type, params) {
//   let canvas = document.getElementById(`canvas-${type}`);
//   let ctx = canvas.getContext('2d');
//   canvas.width = 400;
//   canvas.height = 300;

//   let verly = new Verly(16, canvas, ctx);

//   if (type === 'box') {
//     verly.createBox(...params);
//   } else if (type === 'cloth') {
//     verly.createCloth(...params);
//   } else if (type === 'hexagon') {
//     verly.createHexagon(...params);
//   } else if (type === 'rope') {
//     verly.createRope(...params);
//   } else if (type === 'ragdoll') {
//     verly.createRagdoll(...params);
//   }

//   function animate() {
//     ctx.clearRect(0, 0, width, height);

//     verly.update();
//     verly.render();
//     verly.interact();

//     requestAnimationFrame(animate);
//   }
//   animate();
// }
