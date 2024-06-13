const canvas = document.querySelector("canvas");

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case " ":
      if (player.velocity.y === 0) {
        player.velocity.y = -10;
        player.setAnimation("jump");
      }
      break;
    case "a":
      keys.a.pressed = true;
      player.setAnimation("run");
      player.direction = "left";
      break;
    case "d":
      keys.d.pressed = true;
      player.setAnimation("run");
      player.direction = "right";
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      if (!keys.d.pressed) {
        player.setAnimation("idle");
      }
      break;
    case "d":
      keys.d.pressed = false;
      if (!keys.a.pressed) {
        player.setAnimation("idle");
      }
      break;
  }
});

canvas.addEventListener("mousedown", (event) => {
  if (player.attackCooldown <= 0) {
    player.isAttacking = true; // Set a flag to indicate an attack is initiated
    player.attack();
  }
});
