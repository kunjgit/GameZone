let t=0;
let play = false;
let r1 =50;
let r2 =50;
let r3 =50;
let f1 =13;
let f2 =-7;
let f3 =-3;
let xprev =0;
let yprev =0;
let isRadial = false;
let speed = 1;
let myCanvas;

function setup() {
  myCanvas = createCanvas(600,400);
  myCanvas.parent(canvasContainer);
  background(255);
  colorMode("HSB");
}

pausePlayButton.addEventListener("click",()=>{
  f1 = f1Input.value =="" ? f1:f1Input.value;
  f2 = f2Input.value =="" ? f2:f2Input.value;
  f3 = f3Input.value =="" ? f3:f3Input.value;
  r1 = r1Input.value =="" ? r1:r1Input.value;
  r2 = r2Input.value =="" ? r2:r2Input.value;
  r3 = r3Input.value =="" ? r3:r3Input.value;
  speed = speedInput.value =="" ? speed:parseFloat(speedInput.value);
  f1Input.disabled =true;
  f2Input.disabled =true;
  f3Input.disabled =true;
  r1Input.disabled =true;
  r2Input.disabled =true;
  r3Input.disabled =true;
  speedInput.disabled =true;
  radial.disabled =true;
  isRadial = radial.checked;
  play = !play;
  pausePlayButton.textContent = play ? "Pause" : "Play";
});

resetButton.addEventListener("click",()=>{
  play = false;
  f1Input.disabled = false;
  f2Input.disabled = false;
  f3Input.disabled = false;
  r1Input.disabled = false;
  r2Input.disabled = false;
  r3Input.disabled = false;
  speedInput.disabled = false;
  radial.disabled = false;
  pausePlayButton.textContent = "play";
  myCanvas.clear();
  background(255);
  xprev = 0;
  yprev =0;
  t=0;
});

saveButton.addEventListener("click",()=>{
  saveCanvas("myCanvas","png");
});

function draw() {
  if(!play)
   return;

   translate(width/2,height/2);
   let x=0;
   let y=0;
   let a = [r1,r2,r3];
   let c_n = [f1/100,f2/100,f3/100];
   let c_s= [0,0,0];
    
   for (let i=0; i<3; i++) {
    x+= a[i] * cos(c_n[i]*t+c_s[i]);
    y+= a[i] * sin(c_n[i]*t+c_s[i]);
   }

   if(!isRadial && (xprev !=0 || yprev !=0))
    line(xprev,yprev,x,y);
     xprev = x;
     yprev =y;
  if(isRadial)
  line(0,0,x,y);

  stroke(1*t%255,2*t%255,4*t%255);
  t+= speed;
}





















