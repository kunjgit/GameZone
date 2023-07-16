$.CRT = {};
$.CRT.interval = 3;
$.CRT.init = function() {
  for(var i = 0;i < $.H;i += $.CRT.interval) {
    $.CTX.crt.beginPath();
    $.CTX.crt.fillStyle = "rgba(255, 255, 255, 0.15)";
    $.CTX.crt.rect(0, i, $.W, 1);
    $.CTX.crt.fill();
    $.CTX.crt.beginPath();
    $.CTX.crt.fillStyle = "rgba(255, 255, 255, 0.1)";
    $.CTX.crt.rect(0, i + 1, $.W, 1);
    $.CTX.crt.fill();
  }

  var grd = $.CTX.crt.createRadialGradient($.W / 2, $.H / 2, 250, $.W / 2, $.H / 2 , 340);
  grd.addColorStop(0, "rgba(0, 0, 0, 0)");
  grd.addColorStop(1, "rgba(0, 0, 0, 1)");
  $.CTX.crt.fillStyle = grd;
  $.CTX.crt.fillRect(0, 0, $.W, $.H);
};