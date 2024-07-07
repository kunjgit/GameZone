'use strict';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var step = 2 * Math.PI / 360;
var radius = 120;

var dragStart = false;
var angle = 0;
var speed = 7;
document.getElementById("svalue").innerHTML = speed;
ctx.strokeStyle = '#FA8072';
ctx.lineWidth = radius / 5.5;

function spin() {
    speed = document.getElementById("svalue").innerHTML;
}

function verifyorder() {
    speed = document.getElementById('value').value;
    document.getElementById("svalue").innerHTML = speed;
}



canvas.addEventListener('mousedown', function (_ref) {
  var clientX = _ref.clientX;
  var clientY = _ref.clientY;

  dragStart = { clientX: clientX, clientY: clientY };
});
canvas.addEventListener('touchstart', function (_ref2) {
  var originalEvent = _ref2.originalEvent;

  dragStart = {
    clientX: originalEvent.touches[0].pageX,
    clientY: originalEvent.touches[0].pageY
  };
});
canvas.addEventListener('mousemove', function (_ref3) {
  var clientX = _ref3.clientX;
  var clientY = _ref3.clientY;
  return dragStart && function () {
    updateSpeed(dragStart, { clientX: clientX, clientY: clientY });
    dragStart = { clientX: clientX, clientY: clientY };
  }();
});
canvas.addEventListener('touchmove', function (_ref4) {
  var originalEvent = _ref4.originalEvent;
  return dragStart && function () {
    updateSpeed(dragStart, {
      clientX: originalEvent.touches[0].pageX,
      clientY: originalEvent.touches[0].pageY
    });
    dragStart = {
      clientX: originalEvent.touches[0].pageX,
      clientY: originalEvent.touches[0].pageY
    };
  }();
});
window.addEventListener('mouseup', function () {
  dragStart = false;
});
window.addEventListener('touchend', function () {
  dragStart = false;
});

function updateSpeed(startPos, endPos) {
  speed = (Math.atan2(startPos.clientX - (canvas.offsetLeft + canvas.width / 2), startPos.clientY - (canvas.offsetTop + canvas.height / 2)) - Math.atan2(endPos.clientX - (canvas.offsetLeft + canvas.width / 2), endPos.clientY - (canvas.offsetTop + canvas.height / 2))) * radius;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  angle += step * speed;
  speed = Math.max(speed - 0.08, Math.min(speed + 0.08, 0));

  for (var i = 0; i < 3; i++) {
    var x = canvas.width / 2 + radius * Math.sin(angle + i * (120 * step));
    var y = canvas.height / 2 - radius * Math.cos(angle + i * (120 * step));
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x, y, radius / 2.5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius / 2.5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  window.requestAnimationFrame(render);
}

render();