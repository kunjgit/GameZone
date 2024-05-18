window.onload = function () {
  createInstance(800);
  createInstance(300);
}



function createInstance(w) {
  let canvas = document.createElement('canvas');
  canvas.id = Math.random();
  let ctx = canvas.getContext('2d');
  let width = w;
  let height = 400;
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);

  const verly = new Verly(16, canvas, ctx);

  let box = verly.createBox(100, 100, 100, 100);
  let hexagon = verly.createHexagon(100, 100, 18, random(20, 100));

  // rendering
  box.renderSticks = () => {
    for (let i = 0; i < box.sticks.length; i++) {
      let stick = box.sticks[i];
      ctx.beginPath();
      ctx.strokeStyle = 'green'
      ctx.moveTo(stick.startPoint.pos.x, stick.startPoint.pos.y);
      ctx.lineTo(stick.endPoint.pos.x, stick.endPoint.pos.y);
      ctx.stroke();
      ctx.closePath();
    }
  }


  function animate() {
    ctx.clearRect(0, 0, width, height);
    

    verly.update();
    verly.render();
    verly.interact();

    // verly.renderPointIndex();

    requestAnimationFrame(animate);
  }
  animate();
}