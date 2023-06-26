var timelimit = 10, time=0, foo = true, score = 0, playtime = 0;
var canvasElement, canvas, CANVAS_WIDTH, CANVAS_HEIGHT, threading;
var tile1, tile2, tile3, tile4;
function tle()
{
    var x = document.getElementById('tl').value;
    if(!isNaN(x) && x!="")
        timelimit = x;
    else
        alert('Not a valid time!\nUsing 10 seconds as the default value.');
}

function loadcanvas() {
    keydown.a = false;
    keydown.s = false;
    keydown.d = false;
    foo = true;
    time = 0;
    score = 0;
    playtime = 0;
    timelimit = 10;
    canvasElement = document.getElementById("mycanvas");
    canvasElement.width = $(window).width()/3;
    canvasElement.height = $(window).height() - 50;
    CANVAS_WIDTH = canvasElement.width;
    CANVAS_HEIGHT = canvasElement.height;
    canvas = canvasElement.getContext("2d");
    canvas.fillStyle = 000;
    var xt = Math.floor(Math.random() * 4);
    tile1 = xt;
    xt = Math.floor(Math.random() * 4);
    tile2 = xt;
    xt = Math.floor(Math.random() * 4);
    tile3 = xt;
    xt = Math.floor(Math.random() * 4);
    tile4 = xt;
    console.log(tile1, tile2, tile3, tile4);
    blacktile.draw(tile1, 0);
    blacktile.draw(tile2, 1);
    blacktile.draw(tile3, 2);
    blacktile.draw(tile4, 3);
    drawlines();
    tle();
    clearInterval(threading);
    threading=setInterval(function() {
        time += 0.01;
        if(time>=timelimit)
        {
            clearInterval(threading);
            document.getElementById("score").innerHTML = "You went through " + score + " tiles!";
        }
        else
            document.getElementById("time").innerHTML=time.toPrecision(4);
    }, 10)
}
function drawlines()
{
    canvas.beginPath();
    canvas.moveTo(CANVAS_WIDTH/4,0);
    canvas.lineTo(CANVAS_WIDTH/4,CANVAS_HEIGHT);
    canvas.moveTo(2*CANVAS_WIDTH/4,0);
    canvas.lineTo(2*CANVAS_WIDTH/4,CANVAS_HEIGHT);
    canvas.moveTo(3*CANVAS_WIDTH/4,0);
    canvas.lineTo(3*CANVAS_WIDTH/4,CANVAS_HEIGHT);
    canvas.moveTo(0,CANVAS_HEIGHT/4);
    canvas.lineTo(CANVAS_WIDTH,CANVAS_HEIGHT/4);
    canvas.moveTo(0,2*CANVAS_HEIGHT/4);
    canvas.lineTo(CANVAS_WIDTH,2*CANVAS_HEIGHT/4);
    canvas.moveTo(0,3*CANVAS_HEIGHT/4);
    canvas.lineTo(CANVAS_WIDTH,3*CANVAS_HEIGHT/4);
    canvas.stroke();
}
function draw() {
    var xt = Math.floor(Math.random() * 3);
    var yt = Math.floor(Math.random() * 3);
}
var validkey = ["keydown.a", "keydown.s", "keydown.d"];
var blacktile =
{
    color: "#000",
    x: 0,
    y: 0,
    width: $(window).width()/12,
    height: ($(window).height()-50)/4,
    draw: function(z1, z2)
    {
        canvas.fillStyle = this.color;
        canvas.fillRect(z1*this.width, z2*this.height, this.width, this.height);
    },
    update: function()
    {
        tile4 = tile3;
        tile3 = tile2;
        tile2 = tile1;
        tile1 = Math.floor(Math.random() * 4);
        canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawlines();
        blacktile.draw(tile1, 0);
        blacktile.draw(tile2, 1);
        blacktile.draw(tile3, 2);
        blacktile.draw(tile4, 3);
    }
}
function update(z) {
    if(z==49 || z==50 || z==51 || z==52)
    {
        if((z==49 && tile4==0)||(z==50 && tile4==1)||(z==51 && tile4==2)||(z==52 && tile4==3))
        {
            console.log(tile4);
            score++;
            blacktile.update();
            var audio = document.getElementById("sample");
            audio.currentTime = playtime;
            audio.play();
            audio.addEventListener('timeupdate', function()
            {
                if (audio.currentTime >= playtime + 0.05)
                    audio.pause();
            }, false);
            playtime += 0.2;
        }
        else
        {
            alert('You pressed the wrong key! Game Over.');
            clearInterval(threading);
            document.getElementById("score").innerHTML = "You went through " + score + " tiles!";
            return false;
        }
    }
    document.getElementById("score").innerHTML=score;
    if(time>=timelimit)
    {
        clearInterval(threading);
        document.getElementById("score").innerHTML = "You went through " + score + " tiles!";
        return false;
    }
    return true;
}
$(document).keydown(function (e) {
    console.log(e.which);
    if(foo)
        foo = update(e.which);
});