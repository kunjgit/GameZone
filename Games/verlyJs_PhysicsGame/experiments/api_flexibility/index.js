window.onload = function () {
  let canvas = document.getElementById('c');
  let ctx = canvas.getContext('2d');
  let width = 600;
  let height = 600;
  canvas.width = width;
  canvas.height = height;

  let verly = new Verly(16, canvas, ctx);

  let hexagon = verly.createHexagon(100, 100, 12, 50);
  let hexagon2 = verly.createHexagon(200, 200, 12, 30);
  let rope = verly.createRope(150, 150, 15, 20);

  let mix = verly.joinEntities(hexagon2, hexagon, rope);
  mix.addStick(12, 40, 10);
  mix.addStick(25, 26, 10);
  hexagon.setGravity(new Vector(0, -0.8))


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
