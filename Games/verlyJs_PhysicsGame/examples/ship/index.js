
window.onload = function () {
  let canvas = document.getElementById('c');
  let ctx = canvas.getContext('2d');
  let width = 1200;
  let height = 500;
  canvas.width = width;
  canvas.height = height;

  let ship = new Ship(100, height / 2, 0, 0, 1, canvas);

  let RIGHT_ARROW = false;
  let LEFT_ARROW = false;
  let UP_ARROW = false;
  window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 68:
        RIGHT_ARROW = true;
        break;
      case 65:
        LEFT_ARROW = true;
        break;
      case 87:
        UP_ARROW = true;
        break;
    }
  })
  window.addEventListener('keyup', function (e) {
    switch (e.keyCode) {
      case 68:
        RIGHT_ARROW = false;
        break;
      case 65:
        LEFT_ARROW = false;
        break;
      case 87:
        UP_ARROW = false;
        break;
    }
  })

  let verly = new Verly(60, canvas, ctx);
  let word = new Text('SAK', 300, 300, 25);

  // let box = verly.createHexagon(200, 200, 15, 50);
  let ent = new Entity(60, verly);
  ent.addPoint(ship);
  let boxtmp = verly.joinEntities(word.entity, ent);
  let BOX_POINTS = boxtmp.points.length;

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32) {
      for (let i = 0; i < word.entity.points.length; i++) {
        let d = word.entity.points[i].pos.dist(ship.pos);
        if (d > 0 && d < 50) {
          boxtmp.addStick(i, boxtmp.points.length - 1);
          BOX_POINTS++;
          break;
        }
      }
    }
    if (e.keyCode == 81 && boxtmp.points.length < BOX_POINTS) {
      BOX_POINTS--;
      boxtmp.sticks.pop();
    }
  })


  function animate() {
    ctx.clearRect(0, 0, width, height);

    verly.update();
    verly.render();
    verly.interact();

    ship.renderShip(ctx);
    ship.turn();
    ship.updateShip();
    // ship.edges();
    ship.rotation = 0;
    ship.boosting(false)
    if (RIGHT_ARROW) {
      ship.setRotation(0.1);
    }
    if (LEFT_ARROW) {
      ship.setRotation(-0.1);
    }
    if (UP_ARROW) {
      ship.boosting(true);
    }

    // verly.renderPointIndex();

    requestAnimationFrame(animate);
  }
  animate();
}
