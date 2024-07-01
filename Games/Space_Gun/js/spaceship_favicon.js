var canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;
var ctx = canvas.getContext('2d');
_zoom=0.6;
ctx.fillStyle="rgba(255, 255, 255, 0.85)";
ctx.fillRect(0,0,16,16);
spaceship_fig_draw(6,11,8,1.75);


var link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = canvas.toDataURL("image/x-icon");
document.getElementsByTagName('head')[0].appendChild(link);