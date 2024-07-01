touchintervals = [];

ac = new AirConsole({orientation : AirConsole.ORIENTATION_LANDSCAPE});


window["TS"] = (n) => {
  if(touchintervals[n]){
    clearInterval(touchintervals[n]);
  }

  ac.message(AirConsole.SCREEN, n);
  touchintervals[n] = setInterval(()=>{
    ac.message(AirConsole.SCREEN, n);
  },150);
};

window["TE"] = (n) => {
  setTimeout(()=>{
    clearInterval(touchintervals[n]);
  },150);
};

ontouchend = onmouseup = e => {
  for(i in touchintervals){
    clearInterval(touchintervals[i]);
  }
}