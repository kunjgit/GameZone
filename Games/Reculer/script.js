document.addEventListener("keydown", function (event) {
  x = document.getElementById("actor").getAttribute("position").x;
  y = document.getElementById("actor").getAttribute("position").y;
  z = document.getElementById("actor").getAttribute("position").z;
  if (event.key == "s") {
    //console.log('s');
    //animation=

    document
      .getElementById("actor")
      .setAttribute("position", x + " " + y + " " + (z + 0.05));
  }
  if (event.key == "a") {
    //	console.log('a');

    document
      .getElementById("actor")
      .setAttribute("position", x - 0.02 + " " + y + " " + z);
  }
  if (event.key == "d") {
    //console.log('d');

    document
      .getElementById("actor")
      .setAttribute("position", x + 0.02 + " " + y + " " + z);
  }
});
function respawn() {
  document.getElementById("actor").setAttribute("position", "0 1.252 -3");
  //console.log('YOU LO0SE');
  document.getElementById("cam").setAttribute("rotation", "0 0 0");
}
