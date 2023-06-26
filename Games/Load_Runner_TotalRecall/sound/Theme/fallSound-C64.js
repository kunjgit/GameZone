//http://jsfiddle.net/s3mrkayp/1/
var audioContext = new (AudioContext || webkitAudioContext),
   
osc1 = []

wide = 0.05;
start = 1460
step=20 

for(var i = 0; (start - i * step) > 0; i++) 
{ 
    var osc = []
    osc[i] = audioContext.createOscillator();
    osc[i].connect(audioContext.destination);
    osc[i].frequency.value = (start - i * step) ;
    osc[i].start(i*wide);
    osc[i].stop((i+1)*wide); 
}