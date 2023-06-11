let timerRunning = false,
    mazeSize = 25,
    stage = 1,
    offset = 80,
    currentPosition,
    pixels,
    cells,
    end,
    path,
    maxWire;

let timerDraw = (totalTime, timeLeft) => {
    let parentWidth = Math.min(window.innerWidth, window.innerHeight) - offset;
    document.getElementById("timer").style.width =  parentWidth;
    let ratio = timeLeft / totalTime ; 
    document.getElementById("timerBar").style.width = ratio*parentWidth;
    if (ratio < 0.2){
      document.getElementById("timerBar").style.backgroundColor = "#c00";
    }
    else if (ratio < 0.5 ){
      document.getElementById("timerBar").style.backgroundColor = "#ac0";
    }
    else{
      document.getElementById("timerBar").style.backgroundColor = "#0c0";
    }
    if (timeLeft > 0 && timerRunning) {
        setTimeout(() =>  {
            timerDraw(totalTime, timeLeft - 0.2, parentWidth);
        }, 200);
    }
    else if (timeLeft <= 0) {
      document.getElementById("curtain").innerHTML = "<br /><br /><h2 style='color: red;'>You Lose</h2><p>refresh the page to start again</p>";
      document.getElementById("curtain").style.display = "block";
    }
};

let cableDraw = (totalCable, cableLeft) => {
    let parentWidth = Math.min(window.innerWidth, window.innerHeight) - offset;
    document.getElementById("cable").style.width =  parentWidth;
    let ratio =cableLeft / totalCable ; 
    document.getElementById("cableBar").style.width = ratio*parentWidth;
};

let drawMaze = () => {
  if(!timerRunning){
    let progressWidth = Math.min(window.innerWidth, window.innerHeight) - offset;
    document.getElementById("timer").style.width =  progressWidth;
    document.getElementById("cable").style.width =  progressWidth;
  }
  
  let canvas = document.getElementById('gameCanvas');
  let ctx  = canvas.getContext('2d');
  let ctxSize = Math.min(window.innerWidth, window.innerHeight) - offset;
  canvas.width  = ctxSize;
  canvas.height = ctxSize;

  cableDraw(maxWire, maxWire - path.length)

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#dd2244';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  pixels = Math.min(canvas.width, canvas.height); 
  let scale = pixels / mazeSize;
  let line = (x1, y1, x2, y2) => { 
    ctx.moveTo(x1 + .5, y1 + .5); ctx.lineTo(x2 + .5, y2 + .5); 
  };
  ctx.scale(scale,scale);
  ctx.strokeStyle = '#222a33';
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';
  ctx.lineWidth = .75;
  cells.forEach((column, x) => {
    column.forEach((row, y) => {
      ctx.beginPath();
      if(row & 1) line(x, y, x - 1, y);
      if(row & 2) line(x, y, x + 1, y);
      if(row & 4) line(x, y, x, y - 1);
      if(row & 8) line(x, y, x, y + 1);
      ctx.stroke();
      ctx.closePath;
    });
  });

  ctx.fillStyle = '#222a33';
  ctx.strokeStyle = '#6699cc';
  ctx.lineJoin = 'miter';
  ctx.lineWidth = .1;
  ctx.beginPath();
  ctx.arc(end[0] + .5, end[1] + .5, .25, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  if(path.length) {
    ctx.strokeStyle = '#6699cc';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = .2;
    ctx.beginPath();
    ctx.moveTo(path[0][0] + .5, path[0][1] + .5);
    path.forEach((pathPart) => {
      ctx.lineTo(pathPart[0] + .5, pathPart[1] + .5);
    });
    ctx.lineTo(currentPosition[0] + .5, currentPosition[1] + .5);
    ctx.stroke();
    ctx.closePath();
  }

  ctx.fillStyle = '#6699cc';
  ctx.strokeStyle = '#003399';
  ctx.lineJoin = 'miter';
  ctx.lineWidth = .05;
  ctx.beginPath();
  ctx.arc(currentPosition[0] + .5, currentPosition[1] + .5, .25, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  if(currentPosition[0] == end[0] && currentPosition[1] == end[1]) {
    timerRunning = false;
    setTimeout(()=>{
      document.getElementById("timerBar").style.width = "100%";
      document.getElementById("timerBar").style.backgroundColor = "#0c0";
    }, 1000);
    let curtainText = "";
    if(stage == 1)
      curtainText = "<br /><br /><h2> Stage 1 Completed </h2>";
    else if(stage == 2)
      curtainText = "<br /><br /><h2> Stage 2 Completed </h2><br /><h3 style='color : red;'>Arrow keys inverted !</h3>";
    else if(stage == 3)
      curtainText = "<br /><br /><h2> Stage 3 Completed </h2><br /><h3 style='color : red;'>Arrow keys inverted !</h3>";
    else if(stage == 4)
      curtainText = "<br /><br /><h2>Thanks for playing Cable Maze</h2><p>refresh the page to play again</p><p>created by : rezaxdi (https://github.com/rezaxdi/cablemaze)</p>";
    document.getElementById("curtain").innerHTML = curtainText;
    document.getElementById("curtain").style.display = "block";
    if (stage < 4)
      setTimeout(()=>{document.getElementById("curtain").style.display = "none";}, 3000);
      stage += 1;
    newMaze();
  } 
};

let newMaze = () => {
  path = [];
  currentPosition = [0, 0];
  end = [mazeSize - 1, mazeSize - 1];
  if (stage == 1 || stage == 3){
    maxWire = 52;
    cells = JSON.parse("[[2,10,4,2,8,6,2,10,4,8,12,14,12,4,2,10,12,12,14,6,2,2,10,12,4],[11,5,2,3,8,13,15,13,4,8,12,15,12,12,13,15,12,4,1,1,3,9,7,8,6],[3,8,15,5,2,2,3,10,4,2,8,7,2,10,4,1,10,12,4,2,3,8,15,12,5],[3,2,3,10,5,3,11,13,4,3,8,7,11,13,12,12,13,4,8,13,13,14,15,4,2],[3,3,9,7,8,15,13,4,10,15,14,13,13,14,14,12,6,10,6,2,8,7,1,2,3],[11,5,2,3,2,3,2,2,1,1,3,10,6,1,1,2,1,3,1,3,8,15,4,11,5],[3,8,7,3,11,13,13,13,12,14,7,3,9,12,12,13,4,11,4,9,6,11,4,3,2],[9,12,13,13,15,14,4,2,2,3,1,3,2,2,10,12,4,3,2,2,11,7,10,15,5],[2,2,2,8,7,9,4,3,3,3,2,11,13,5,11,4,2,3,3,11,5,1,3,1,2],[3,11,13,6,11,4,2,11,5,3,3,11,12,6,3,10,5,9,7,11,12,4,11,4,3],[9,13,4,11,5,2,11,13,4,3,3,3,2,1,3,3,10,12,13,13,12,14,5,2,3],[10,6,8,7,2,11,13,4,8,13,7,3,3,10,13,13,7,8,14,12,4,1,2,9,7],[3,9,12,7,3,3,2,10,4,8,7,11,13,15,4,2,1,8,7,8,14,12,5,2,3],[1,2,8,7,3,9,13,15,12,4,11,13,6,11,4,3,2,10,5,2,3,10,4,9,7],[8,13,12,13,7,2,2,11,12,4,11,4,1,9,12,5,11,5,2,3,3,3,10,12,5],[8,12,14,4,9,13,15,13,4,10,13,4,10,12,4,2,11,6,11,13,5,9,7,8,6],[10,12,7,8,6,2,9,14,4,3,10,4,3,10,4,3,3,9,5,8,14,4,11,12,5],[3,8,13,12,13,15,14,15,4,11,13,12,13,5,2,11,5,2,2,10,13,4,11,4,2],[1,8,12,12,12,5,1,9,6,11,12,4,10,4,3,3,10,13,5,11,12,4,11,12,7],[8,6,2,8,12,14,12,14,13,15,6,10,5,8,13,7,3,10,12,15,6,10,15,6,3],[8,13,13,12,6,1,8,7,8,5,3,11,4,2,10,13,13,7,2,1,11,5,1,1,1],[10,14,12,14,13,12,14,13,12,6,9,15,14,13,15,12,6,9,13,6,9,12,4,10,4],[1,3,10,5,10,12,7,8,14,5,8,7,11,6,1,2,11,12,4,11,12,12,6,11,4],[10,7,3,8,13,6,1,8,7,2,8,7,1,11,12,5,1,10,4,9,4,8,15,15,4],[1,1,9,4,8,13,4,8,5,9,12,13,4,9,12,12,12,13,12,12,12,4,1,9,4]]");
    drawMaze();
  }
  else if(stage == 2 || stage == 4){
    maxWire = 110;
    cells = JSON.parse("[[10,12,12,12,12,12,14,12,12,12,12,6,2,10,12,12,14,12,6,10,12,12,12,6,2],[9,6,8,14,6,10,7,10,12,12,6,3,3,9,12,6,3,8,13,5,10,6,10,5,3],[8,13,12,5,1,3,1,11,12,4,3,9,7,2,10,5,9,14,6,8,7,1,9,6,3],[10,14,12,12,12,5,10,5,10,12,5,2,3,11,5,10,6,3,9,6,3,10,12,5,3],[3,3,10,12,12,12,5,10,7,10,6,9,5,3,10,5,3,11,4,3,11,5,8,14,7],[3,1,9,12,6,10,6,3,1,3,3,10,12,13,7,2,3,1,10,5,3,10,12,5,1],[11,12,12,12,5,3,3,3,10,5,9,5,10,6,3,9,13,12,5,2,3,9,12,12,6],[9,6,10,12,12,5,3,9,5,10,12,12,5,3,9,12,12,6,10,7,9,12,6,10,5],[10,5,9,6,10,4,3,10,6,11,12,12,6,3,2,10,6,3,3,9,4,10,5,11,6],[9,6,10,5,9,14,5,1,9,13,4,10,5,9,7,3,3,3,11,12,12,5,8,7,3],[10,5,9,12,6,9,6,10,12,12,12,5,2,10,5,3,9,5,3,8,12,14,6,1,3],[3,10,12,12,5,2,3,11,12,6,10,6,9,7,2,9,12,6,9,12,6,3,9,12,7],[3,3,10,4,10,13,5,9,6,9,5,9,6,9,13,6,10,5,10,6,9,5,2,10,5],[9,5,11,12,5,8,6,10,13,12,6,2,3,2,10,5,9,12,5,9,14,6,3,3,2],[10,12,5,8,14,6,9,7,10,6,9,7,3,11,5,8,14,4,10,6,1,3,11,13,7],[3,8,14,6,3,9,6,1,3,9,6,3,3,9,12,12,7,10,5,9,6,9,7,2,3],[3,10,5,9,5,2,3,10,5,2,3,1,9,12,6,10,5,3,8,12,13,12,5,11,5],[9,5,10,12,12,5,9,5,10,7,3,10,12,12,5,9,6,3,10,14,4,10,6,3,2],[10,6,9,12,14,12,6,10,5,3,9,5,10,12,6,2,3,9,5,9,6,3,3,3,3],[3,9,12,6,11,4,9,5,10,13,12,6,9,6,9,5,9,6,10,12,7,3,3,3,3],[3,8,6,3,3,10,6,10,5,8,12,13,12,7,10,12,12,5,3,10,5,3,3,9,7],[3,10,5,3,1,3,9,5,10,12,12,6,10,5,3,10,12,14,5,1,10,5,3,2,3],[3,9,12,13,12,5,10,6,3,8,6,3,1,10,5,3,8,5,10,6,3,10,5,11,5],[3,10,12,12,12,6,3,3,3,10,7,9,6,3,2,9,6,10,5,3,3,9,6,9,6],[9,13,12,12,4,9,5,9,13,5,9,4,9,13,13,4,9,13,4,9,13,4,9,4,1]]");
    drawMaze();
  }

};

let keyToNeighbor = { '-1': {'0': 1}, '1': {'0': 2}, '0': {'-1': 4, '1': 8} };
let move = (x, y) => {
  let neighbor = 0;
  try{
    neighbor = keyToNeighbor[x - currentPosition[0]][y -  currentPosition[1]];
  }
  catch (e){
    console.log(e);
  }
  let mask = cells[currentPosition[0]][currentPosition[1]];

  if(mask & neighbor) {
    if(path.length && x == path[path.length - 1][0] && y == path[path.length - 1][1]){
      path.pop();
      currentPosition = [x, y];
      drawMaze();
    }
    else{
      path.push(currentPosition);
      if(path.length > maxWire){
        path.pop();
        document.getElementById("popover").style.display = "block";
        setTimeout(() => {document.getElementById("popover").style.display = "none";}, 1000);
      }
      else{
        currentPosition = [x, y];
        drawMaze();
      }
    }
  }
}

let keydownFunc = (e) => {
  let timerWidth = Math.min(window.innerWidth, window.innerHeight) - offset;
  if(!timerRunning){
    timerRunning = true;
    if(stage == 1 || stage == 3)
      timerDraw(60, 60);
    else
      timerDraw(40, 40);
  }
  if(e.keyCode > 36 && e.keyCode < 41){
    if (stage == 1 || stage == 2)
      move(currentPosition[0] + ((e.keyCode - 38) % 2), currentPosition[1] + ((e.keyCode - 39) % 2));
    else
      move(currentPosition[0] - ((e.keyCode - 38) % 2), currentPosition[1] - ((e.keyCode - 39) % 2));
  }
};

document.addEventListener('keydown', keydownFunc);

window.onload = newMaze;
window.onresize = drawMaze;

document.getElementById("curtain").style.display = "block";
document.addEventListener("click", () => {
    document.getElementById("curtain").style.display = "none";
});