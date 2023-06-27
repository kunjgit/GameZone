//Llamando a los elementos
let background = document.querySelector('.background');
let sonic = document.querySelector('.sonic');
let ring = document.querySelector('.ring');
let ring2 = document.querySelector('.ring2');
let ring3 = document.querySelector('.ring3');
let ring4 = document.querySelector('.ring4');
let ring5 = document.querySelector('.ring5');
let ring6 = document.querySelector('.ring6');
let ring7 = document.querySelector('.ring7');
let ring8 = document.querySelector('.ring8');
let ring9 = document.querySelector('.ring9');
let ring10 = document.querySelector('.ring10');
let ring11 = document.querySelector('.ring11');
let ring12 = document.querySelector('.ring12');
let ring13 = document.querySelector('.ring13');
let ring14 = document.querySelector('.ring14');
let ring15 = document.querySelector('.ring15');
let ring16 = document.querySelector('.ring16');
let ring17 = document.querySelector('.ring17');
let ring18 = document.querySelector('.ring18');
let ring19 = document.querySelector('.ring19');
let ring20 = document.querySelector('.ring20');
let ring21 = document.querySelector('.ring21');
let ring22 = document.querySelector('.ring22');
let ring23 = document.querySelector('.ring23');
let ring24 = document.querySelector('.ring24');
let ring25 = document.querySelector('.ring25');
let ring26 = document.querySelector('.ring26');
let ring27 = document.querySelector('.ring27');
let ring28 = document.querySelector('.ring28');
let ring29 = document.querySelector('.ring29');
let ring30 = document.querySelector('.ring30');
let ring31 = document.querySelector('.ring31');
let ring32 = document.querySelector('.ring32');
let ring33 = document.querySelector('.ring33');
let ring34 = document.querySelector('.ring34');
let ring35 = document.querySelector('.ring35');
let ring36 = document.querySelector('.ring36');
let ring37 = document.querySelector('.ring37');
let ring38 = document.querySelector('.ring38');
let ring39 = document.querySelector('.ring39');
let ring40 = document.querySelector('.ring40');
let ring41 = document.querySelector('.ring41');
let ring42 = document.querySelector('.ring42');
let ring43 = document.querySelector('.ring43');
let ring44 = document.querySelector('.ring44');
let ring45 = document.querySelector('.ring45');
let ring46 = document.querySelector('.ring46');
let ring47 = document.querySelector('.ring47');
let ring48 = document.querySelector('.ring48');
let ring49 = document.querySelector('.ring49');
let ring50 = document.querySelector('.ring50');

let eggman = document.querySelector('.eggman');
let spikes = document.querySelector('.spikes');
let spikes2 = document.querySelector('.spikes2');
let spikes3 = document.querySelector('.spikes3');
let spikes4 = document.querySelector('.spikes4');
let spikes5 = document.querySelector('.spikes5');

let puntaje = document.querySelector('.score');
let keepRuning = document.querySelector('.keep');
let eggman2 = document.querySelector('.eggman2');

let win = document.querySelector('.win');
let morir = document.querySelector('.die');

//Musica de fondo

var song = new Audio('./audio/greenHill.mp3');    




//Velocidad de movimiento
let moveBy = 18;

 
var x=0; //contador para saber la posicion horizontal de sonic
var y=0; //contador para saber la posicion vertical de sonic

var score = 0;//puntaje del jugador


window.addEventListener('load', () => {
    //Valores iniciales
    sonic.style.position = 'relative';
    sonic.style.left = "120px";
    sonic.style.top = "95px";

    eggman.style.position = 'relative';
    eggman.style.left = "925px"; //+50
    eggman.style.top = "-2130px";  //+40      

    ring.style.position = 'relative';
    ring.style.left = "730px";
    ring.style.top = "40px";

    ring2.style.position = 'relative';
    ring2.style.left = "780px";
    ring2.style.top = "0px";

    ring3.style.position = 'relative';
    ring3.style.left = "830px";
    ring3.style.top = "-40px";

    ring4.style.position = 'relative';
    ring4.style.left = "880px";
    ring4.style.top = "-80px";

    ring5.style.position = 'relative';
    ring5.style.left = "1330px";
    ring5.style.top = "-120px";

    ring6.style.position = 'relative';
    ring6.style.left = "1380px";
    ring6.style.top = "-160px";

    ring7.style.position = 'relative';
    ring7.style.left = "1430px";
    ring7.style.top = "-200px";

    ring8.style.position = 'relative';
    ring8.style.left = "1480px";
    ring8.style.top = "-240px";

    ring9.style.position = 'relative';
    ring9.style.left = "1530px";
    ring9.style.top = "-280px";

    ring10.style.position = 'relative';
    ring10.style.left = "1580px"; //+50
    ring10.style.top = "-320px";  //+40  

    ring11.style.position = 'relative'; //UP
    ring11.style.left = "807px"; //+50
    ring11.style.top = "-450px";  //+40 
    
    ring12.style.position = 'relative'; //UP
    ring12.style.left = "1960px"; //+50
    ring12.style.top = "-490px";  //+40 

    ring13.style.position = 'relative'; //UP
    ring13.style.left = "2020px"; //+50
    ring13.style.top = "-530px";  //+40 

    ring14.style.position = 'relative'; //UP
    ring14.style.left = "2080px"; //+50
    ring14.style.top = "-570px";  //+40
    
    ring15.style.position = 'relative'; //UP
    ring15.style.left = "2530px"; //+50
    ring15.style.top = "-525px";  //+40
    
    ring16.style.position = 'relative'; //UP
    ring16.style.left = "2580px"; //+50
    ring16.style.top = "-565px";  //+40

    ring17.style.position = 'relative'; 
    ring17.style.left = "2630px"; //+50
    ring17.style.top = "-605px";  //+40

    ring18.style.position = 'relative'; 
    ring18.style.left = "2680px"; //+50
    ring18.style.top = "-645px";  //+40

    ring19.style.position = 'relative'; 
    ring19.style.left = "2730px"; //+50
    ring19.style.top = "-685px";  //+40

    ring20.style.position = 'relative'; //UP
    ring20.style.left = "3130px"; //+50
    ring20.style.top = "-810px";  //+40

    ring21.style.position = 'relative'; //UP
    ring21.style.left = "3180px"; //+50
    ring21.style.top = "-850px";  //+40

    spikes.style.position = 'relative'; //UP
    spikes.style.left = "3250px"; //+50
    spikes.style.top = "-925px";  //+40

    ring22.style.position = 'relative'; //UP
    ring22.style.left = "3350px"; //+50
    ring22.style.top = "-980px";  //+40

    ring23.style.position = 'relative'; //UP
    ring23.style.left = "3400px"; //+50
    ring23.style.top = "-1020px";  //+40

    ring24.style.position = 'relative'; 
    ring24.style.left = "3125px"; //+50
    ring24.style.top = "-980px";  //+40

    ring25.style.position = 'relative'; 
    ring25.style.left = "3175px"; //+50
    ring25.style.top = "-1020px";  //+40

    ring26.style.position = 'relative'; 
    ring26.style.left = "3225px"; //+50
    ring26.style.top = "-1060px";  //+40

    ring27.style.position = 'relative'; 
    ring27.style.left = "3275px"; //+50
    ring27.style.top = "-1100px";  //+40

    ring28.style.position = 'relative'; 
    ring28.style.left = "3325px"; //+50
    ring28.style.top = "-1140px";  //+40

    ring29.style.position = 'relative'; 
    ring29.style.left = "3850px"; //+50
    ring29.style.top = "-1180px";  //+40

    ring30.style.position = 'relative'; 
    ring30.style.left = "3900px"; //+50
    ring30.style.top = "-1220px";  //+40

    ring31.style.position = 'relative'; 
    ring31.style.left = "3950px"; //+50
    ring31.style.top = "-1260px";  //+40

    ring32.style.position = 'relative'; 
    ring32.style.left = "4000px"; //+50
    ring32.style.top = "-1300px";  //+40

    ring33.style.position = 'relative'; 
    ring33.style.left = "4050px"; //+50
    ring33.style.top = "-1340px";  //+40

    ring34.style.position = 'relative'; 
    ring34.style.left = "4100px"; //+50
    ring34.style.top = "-1380px";  //+40

    ring35.style.position = 'relative'; 
    ring35.style.left = "4150px"; //+50
    ring35.style.top = "-1420px";  //+40

    ring36.style.position = 'relative'; 
    ring36.style.left = "4200px"; //+50
    ring36.style.top = "-1460px";  //+40

    ring37.style.position = 'relative'; 
    ring37.style.left = "4250px"; //+50
    ring37.style.top = "-1500px";  //+40

    ring38.style.position = 'relative'; 
    ring38.style.left = "4300px"; //+50
    ring38.style.top = "-1540px";  //+40

    ring39.style.position = 'relative'; 
    ring39.style.left = "4900px"; //+50
    ring39.style.top = "-1660px";  //+40

    ring40.style.position = 'relative'; 
    ring40.style.left = "4970px"; //+50
    ring40.style.top = "-1700px";  //+40

    ring41.style.position = 'relative'; 
    ring41.style.left = "5040px"; //+50
    ring41.style.top = "-1740px";  //+40

    ring42.style.position = 'relative'; 
    ring42.style.left = "5040px"; //+50
    ring42.style.top = "-1700px";  //+40

    ring43.style.position = 'relative'; 
    ring43.style.left = "5090px"; //+50
    ring43.style.top = "-1740px";  //+40

    ring44.style.position = 'relative'; 
    ring44.style.left = "5140px"; //+50
    ring44.style.top = "-1780px";  //+40

    ring45.style.position = 'relative'; 
    ring45.style.left = "5190px"; //+50
    ring45.style.top = "-1820px";  //+40

    ring46.style.position = 'relative'; 
    ring46.style.left = "5240px"; //+50
    ring46.style.top = "-1860px";  //+40

    ring47.style.position = 'relative'; 
    ring47.style.left = "5290px"; //+50
    ring47.style.top = "-1900px";  //+40

    ring48.style.position = 'relative'; 
    ring48.style.left = "5340px"; //+50
    ring48.style.top = "-1940px";  //+40

    ring49.style.position = 'relative'; 
    ring49.style.left = "5630px"; //+50
    ring49.style.top = "-2050px";  //+40

    ring50.style.position = 'relative'; 
    ring50.style.left = "5750px"; //+50
    ring50.style.top = "-2090px";  //+40

    spikes2.style.position = 'relative'; 
    spikes2.style.left = "3850px"; //+50
    spikes2.style.top = "-2315px";  //+40

    spikes3.style.position = 'relative'; 
    spikes3.style.left = "3930px"; //+50
    spikes3.style.top = "-2405px";  //+40

    spikes4.style.position = 'relative'; 
    spikes4.style.left = "4010px"; //+50
    spikes4.style.top = "-2495px";  //+40

    spikes5.style.position = 'relative'; 
    spikes5.style.left = "5110px"; //+50
    spikes5.style.top = "-2585px";  //+40

    puntaje.style.position = 'relative'; 
    puntaje.style.left = "10px"; //+50
    puntaje.style.top = "-2650px";  //+40

    keepRuning.style.position = 'relative';
    keepRuning.style.top="-2650px";
    keepRuning.style.left = "10px"

    eggman2.style.position = 'relative'; 
    eggman2.style.left = "4000px"; //+50
    eggman2.style.top = "-2675px";  //+40

    win.style.position = 'relative';
    win.style.top="-2745px";
    win.style.left = "220px"

    morir.style.position = 'relative';
    morir.style.top="-2768px";
    morir.style.left = "220px"

});

//Funciones de movimiento
//IZQUIERDA
function runLeft(){
    ring.style.left = parseInt(ring.style.left) + moveBy + 'px';
    ring2.style.left = parseInt(ring2.style.left) + moveBy + 'px';
    ring3.style.left = parseInt(ring3.style.left) + moveBy + 'px';
    ring4.style.left = parseInt(ring4.style.left) + moveBy + 'px';
    ring5.style.left = parseInt(ring5.style.left) + moveBy + 'px';
    ring6.style.left = parseInt(ring6.style.left) + moveBy + 'px';
    ring7.style.left = parseInt(ring7.style.left) + moveBy + 'px';
    ring8.style.left = parseInt(ring8.style.left) + moveBy + 'px';
    ring9.style.left = parseInt(ring9.style.left) + moveBy + 'px';
    ring10.style.left = parseInt(ring10.style.left) + moveBy + 'px';
    ring11.style.left = parseInt(ring11.style.left) + moveBy + 'px';
    ring12.style.left = parseInt(ring12.style.left) + moveBy + 'px';
    ring13.style.left = parseInt(ring13.style.left) + moveBy + 'px';
    ring14.style.left = parseInt(ring14.style.left) + moveBy + 'px';
    ring15.style.left = parseInt(ring15.style.left) + moveBy + 'px';
    ring16.style.left = parseInt(ring16.style.left) + moveBy + 'px';
    ring17.style.left = parseInt(ring17.style.left) + moveBy + 'px';
    ring18.style.left = parseInt(ring18.style.left) + moveBy + 'px';
    ring19.style.left = parseInt(ring19.style.left) + moveBy + 'px';
    ring20.style.left = parseInt(ring20.style.left) + moveBy + 'px';
    ring21.style.left = parseInt(ring21.style.left) + moveBy + 'px';
    ring22.style.left = parseInt(ring22.style.left) + moveBy + 'px';
    ring23.style.left = parseInt(ring23.style.left) + moveBy + 'px';
    ring24.style.left = parseInt(ring24.style.left) + moveBy + 'px';
    ring25.style.left = parseInt(ring25.style.left) + moveBy + 'px';
    ring26.style.left = parseInt(ring26.style.left) + moveBy + 'px';
    ring27.style.left = parseInt(ring27.style.left) + moveBy + 'px';
    ring28.style.left = parseInt(ring28.style.left) + moveBy + 'px';
    ring29.style.left = parseInt(ring29.style.left) + moveBy + 'px';
    ring30.style.left = parseInt(ring30.style.left) + moveBy + 'px';
    ring31.style.left = parseInt(ring31.style.left) + moveBy + 'px';
    ring32.style.left = parseInt(ring32.style.left) + moveBy + 'px';
    ring33.style.left = parseInt(ring33.style.left) + moveBy + 'px';
    ring34.style.left = parseInt(ring34.style.left) + moveBy + 'px';
    ring35.style.left = parseInt(ring35.style.left) + moveBy + 'px';
    ring36.style.left = parseInt(ring36.style.left) + moveBy + 'px';
    ring37.style.left = parseInt(ring37.style.left) + moveBy + 'px';
    ring38.style.left = parseInt(ring38.style.left) + moveBy + 'px';
    ring39.style.left = parseInt(ring39.style.left) + moveBy + 'px';
    ring40.style.left = parseInt(ring40.style.left) + moveBy + 'px';
    ring41.style.left = parseInt(ring41.style.left) + moveBy + 'px';
    ring42.style.left = parseInt(ring42.style.left) + moveBy + 'px';
    ring43.style.left = parseInt(ring43.style.left) + moveBy + 'px';
    ring44.style.left = parseInt(ring44.style.left) + moveBy + 'px';
    ring45.style.left = parseInt(ring45.style.left) + moveBy + 'px';
    ring46.style.left = parseInt(ring46.style.left) + moveBy + 'px';
    ring47.style.left = parseInt(ring47.style.left) + moveBy + 'px';
    ring48.style.left = parseInt(ring48.style.left) + moveBy + 'px';
    ring49.style.left = parseInt(ring49.style.left) + moveBy + 'px';
    ring50.style.left = parseInt(ring50.style.left) + moveBy + 'px';

    spikes.style.left = parseInt(spikes.style.left) + moveBy + 'px';
    spikes2.style.left = parseInt(spikes2.style.left) + moveBy + 'px';
    spikes3.style.left = parseInt(spikes3.style.left) + moveBy + 'px';
    spikes4.style.left = parseInt(spikes4.style.left) + moveBy + 'px';
    spikes5.style.left = parseInt(spikes5.style.left) + moveBy + 'px';

    eggman.style.left = parseInt(eggman.style.left) + moveBy + 'px';
    x--;

}
//DERECHA  
function runRight(){
    ring.style.left = parseInt(ring.style.left) - moveBy + 'px';
    ring2.style.left = parseInt(ring2.style.left) - moveBy + 'px';
    ring3.style.left = parseInt(ring3.style.left) - moveBy + 'px';
    ring4.style.left = parseInt(ring4.style.left) - moveBy + 'px';
    ring5.style.left = parseInt(ring5.style.left) - moveBy + 'px';
    ring6.style.left = parseInt(ring6.style.left) - moveBy + 'px';
    ring7.style.left = parseInt(ring7.style.left) - moveBy + 'px';
    ring8.style.left = parseInt(ring8.style.left) - moveBy + 'px';
    ring9.style.left = parseInt(ring9.style.left) - moveBy + 'px';
    ring10.style.left = parseInt(ring10.style.left) - moveBy + 'px';
    ring11.style.left = parseInt(ring11.style.left) - moveBy + 'px';
    ring12.style.left = parseInt(ring12.style.left) - moveBy + 'px';
    ring13.style.left = parseInt(ring13.style.left) - moveBy + 'px';
    ring14.style.left = parseInt(ring14.style.left) - moveBy + 'px';
    ring15.style.left = parseInt(ring15.style.left) - moveBy + 'px';
    ring16.style.left = parseInt(ring16.style.left) - moveBy + 'px';
    ring17.style.left = parseInt(ring17.style.left) - moveBy + 'px';
    ring18.style.left = parseInt(ring18.style.left) - moveBy + 'px';
    ring19.style.left = parseInt(ring19.style.left) - moveBy + 'px';
    ring20.style.left = parseInt(ring20.style.left) - moveBy + 'px';
    ring21.style.left = parseInt(ring21.style.left) - moveBy + 'px';
    ring22.style.left = parseInt(ring22.style.left) - moveBy + 'px';
    ring23.style.left = parseInt(ring23.style.left) - moveBy + 'px';
    ring24.style.left = parseInt(ring24.style.left) - moveBy + 'px';
    ring25.style.left = parseInt(ring25.style.left) - moveBy + 'px';
    ring26.style.left = parseInt(ring26.style.left) - moveBy + 'px';
    ring27.style.left = parseInt(ring27.style.left) - moveBy + 'px';
    ring28.style.left = parseInt(ring28.style.left) - moveBy + 'px';
    ring29.style.left = parseInt(ring29.style.left) - moveBy + 'px';
    ring30.style.left = parseInt(ring30.style.left) - moveBy + 'px';
    ring31.style.left = parseInt(ring31.style.left) - moveBy + 'px';
    ring32.style.left = parseInt(ring32.style.left) - moveBy + 'px';
    ring33.style.left = parseInt(ring33.style.left) - moveBy + 'px';
    ring34.style.left = parseInt(ring34.style.left) - moveBy + 'px';
    ring35.style.left = parseInt(ring35.style.left) - moveBy + 'px';
    ring36.style.left = parseInt(ring36.style.left) - moveBy + 'px';
    ring37.style.left = parseInt(ring37.style.left) - moveBy + 'px';
    ring38.style.left = parseInt(ring38.style.left) - moveBy + 'px';
    ring39.style.left = parseInt(ring39.style.left) - moveBy + 'px';
    ring40.style.left = parseInt(ring40.style.left) - moveBy + 'px';
    ring41.style.left = parseInt(ring41.style.left) - moveBy + 'px';
    ring42.style.left = parseInt(ring42.style.left) - moveBy + 'px';
    ring43.style.left = parseInt(ring43.style.left) - moveBy + 'px';
    ring44.style.left = parseInt(ring44.style.left) - moveBy + 'px';
    ring45.style.left = parseInt(ring45.style.left) - moveBy + 'px';
    ring46.style.left = parseInt(ring46.style.left) - moveBy + 'px';
    ring47.style.left = parseInt(ring47.style.left) - moveBy + 'px';
    ring48.style.left = parseInt(ring48.style.left) - moveBy + 'px';
    ring49.style.left = parseInt(ring49.style.left) - moveBy + 'px';
    ring50.style.left = parseInt(ring50.style.left) - moveBy + 'px';

    spikes.style.left = parseInt(spikes.style.left) - moveBy + 'px';
    spikes2.style.left = parseInt(spikes2.style.left) - moveBy + 'px';
    spikes3.style.left = parseInt(spikes3.style.left) - moveBy + 'px';
    spikes4.style.left = parseInt(spikes4.style.left) - moveBy + 'px';
    spikes5.style.left = parseInt(spikes5.style.left) - moveBy + 'px';

    eggman.style.left = parseInt(eggman.style.left) + moveBy + 'px';
    x++;

}

function XrunLeft(){
    ring.style.left = parseInt(ring.style.left) + 0 + 'px';
    ring2.style.left = parseInt(ring2.style.left) + 0 + 'px';
    ring3.style.left = parseInt(ring3.style.left) + 0 + 'px';
    ring4.style.left = parseInt(ring4.style.left) + 0 + 'px';
    ring5.style.left = parseInt(ring5.style.left) + 0 + 'px';
    ring6.style.left = parseInt(ring6.style.left) + 0 + 'px';
    ring7.style.left = parseInt(ring7.style.left) + 0 + 'px';
    ring8.style.left = parseInt(ring8.style.left) + 0 + 'px';
    ring9.style.left = parseInt(ring9.style.left) + 0 + 'px';
    ring10.style.left = parseInt(ring10.style.left) + 0 + 'px';
    ring11.style.left = parseInt(ring11.style.left) + 0 + 'px';
    ring12.style.left = parseInt(ring12.style.left) + 0 + 'px';
    ring13.style.left = parseInt(ring13.style.left) + 0 + 'px';
    ring14.style.left = parseInt(ring14.style.left) + 0 + 'px';
    ring15.style.left = parseInt(ring15.style.left) + 0 + 'px';
    ring16.style.left = parseInt(ring16.style.left) + 0 + 'px';
    ring17.style.left = parseInt(ring17.style.left) + 0 + 'px';
    ring18.style.left = parseInt(ring18.style.left) + 0 + 'px';
    ring19.style.left = parseInt(ring19.style.left) + 0 + 'px';
    ring20.style.left = parseInt(ring20.style.left) + 0 + 'px';
    ring21.style.left = parseInt(ring21.style.left) + 0 + 'px';
    ring22.style.left = parseInt(ring22.style.left) + 0 + 'px';
    ring23.style.left = parseInt(ring23.style.left) + 0 + 'px';
    ring24.style.left = parseInt(ring24.style.left) + 0 + 'px';
    ring25.style.left = parseInt(ring25.style.left) + 0 + 'px';
    ring26.style.left = parseInt(ring26.style.left) + 0 + 'px';
    ring27.style.left = parseInt(ring27.style.left) + 0 + 'px';
    ring28.style.left = parseInt(ring28.style.left) + 0 + 'px';
    ring29.style.left = parseInt(ring29.style.left) + 0 + 'px';
    ring30.style.left = parseInt(ring30.style.left) + 0 + 'px';
    ring31.style.left = parseInt(ring31.style.left) + 0 + 'px';
    ring32.style.left = parseInt(ring32.style.left) + 0 + 'px';
    ring33.style.left = parseInt(ring33.style.left) + 0 + 'px';
    ring34.style.left = parseInt(ring34.style.left) + 0 + 'px';
    ring35.style.left = parseInt(ring35.style.left) + 0 + 'px';
    ring36.style.left = parseInt(ring36.style.left) + 0 + 'px';
    ring37.style.left = parseInt(ring37.style.left) + 0 + 'px';
    ring38.style.left = parseInt(ring38.style.left) + 0 + 'px';
    ring39.style.left = parseInt(ring39.style.left) + 0 + 'px';
    ring40.style.left = parseInt(ring40.style.left) + 0 + 'px';
    ring41.style.left = parseInt(ring41.style.left) + 0 + 'px';
    ring42.style.left = parseInt(ring42.style.left) + 0 + 'px';
    ring43.style.left = parseInt(ring43.style.left) + 0 + 'px';
    ring44.style.left = parseInt(ring44.style.left) + 0 + 'px';
    ring45.style.left = parseInt(ring45.style.left) + 0 + 'px';
    ring46.style.left = parseInt(ring46.style.left) + 0 + 'px';
    ring47.style.left = parseInt(ring47.style.left) + 0 + 'px';
    ring48.style.left = parseInt(ring48.style.left) + 0 + 'px';
    ring49.style.left = parseInt(ring49.style.left) + 0 + 'px';
    ring50.style.left = parseInt(ring50.style.left) + 0 + 'px';

    spikes.style.left = parseInt(spikes.style.left) + 0 + 'px';
    spikes2.style.left = parseInt(spikes2.style.left) + 0 + 'px';
    spikes3.style.left = parseInt(spikes3.style.left) + 0 + 'px';
    spikes4.style.left = parseInt(spikes4.style.left) + 0 + 'px';
    spikes5.style.left = parseInt(spikes5.style.left) + 0 + 'px';

    eggman.style.left = parseInt(eggman.style.left) + 0 + 'px';
    x--;

}
//DERECHA  
function XrunRight(){
    ring.style.left = parseInt(ring.style.left) - 0 + 'px';
    ring2.style.left = parseInt(ring2.style.left) - 0 + 'px';
    ring3.style.left = parseInt(ring3.style.left) - 0 + 'px';
    ring4.style.left = parseInt(ring4.style.left) - 0 + 'px';
    ring5.style.left = parseInt(ring5.style.left) - 0 + 'px';
    ring6.style.left = parseInt(ring6.style.left) - 0 + 'px';
    ring7.style.left = parseInt(ring7.style.left) - 0 + 'px';
    ring8.style.left = parseInt(ring8.style.left) - 0 + 'px';
    ring9.style.left = parseInt(ring9.style.left) - 0 + 'px';
    ring10.style.left = parseInt(ring10.style.left) - 0 + 'px';
    ring11.style.left = parseInt(ring11.style.left) - 0 + 'px';
    ring12.style.left = parseInt(ring12.style.left) - 0 + 'px';
    ring13.style.left = parseInt(ring13.style.left) - 0 + 'px';
    ring14.style.left = parseInt(ring14.style.left) - 0 + 'px';
    ring15.style.left = parseInt(ring15.style.left) - 0 + 'px';
    ring16.style.left = parseInt(ring16.style.left) - 0 + 'px';
    ring17.style.left = parseInt(ring17.style.left) - 0 + 'px';
    ring18.style.left = parseInt(ring18.style.left) - 0 + 'px';
    ring19.style.left = parseInt(ring19.style.left) - 0 + 'px';
    ring20.style.left = parseInt(ring20.style.left) - 0 + 'px';
    ring21.style.left = parseInt(ring21.style.left) - 0 + 'px';
    ring22.style.left = parseInt(ring22.style.left) - 0 + 'px';
    ring23.style.left = parseInt(ring23.style.left) - 0 + 'px';
    ring24.style.left = parseInt(ring24.style.left) - 0 + 'px';
    ring25.style.left = parseInt(ring25.style.left) - 0 + 'px';
    ring26.style.left = parseInt(ring26.style.left) - 0 + 'px';
    ring27.style.left = parseInt(ring27.style.left) - 0 + 'px';
    ring28.style.left = parseInt(ring28.style.left) - 0 + 'px';
    ring29.style.left = parseInt(ring29.style.left) - 0 + 'px';
    ring30.style.left = parseInt(ring30.style.left) - 0 + 'px';
    ring31.style.left = parseInt(ring31.style.left) - 0 + 'px';
    ring32.style.left = parseInt(ring32.style.left) - 0 + 'px';
    ring33.style.left = parseInt(ring33.style.left) - 0 + 'px';
    ring34.style.left = parseInt(ring34.style.left) - 0 + 'px';
    ring35.style.left = parseInt(ring35.style.left) - 0 + 'px';
    ring36.style.left = parseInt(ring36.style.left) - 0 + 'px';
    ring37.style.left = parseInt(ring37.style.left) - 0 + 'px';
    ring38.style.left = parseInt(ring38.style.left) - 0 + 'px';
    ring39.style.left = parseInt(ring39.style.left) - 0 + 'px';
    ring40.style.left = parseInt(ring40.style.left) - 0 + 'px';
    ring41.style.left = parseInt(ring41.style.left) - 0 + 'px';
    ring42.style.left = parseInt(ring42.style.left) - 0 + 'px';
    ring43.style.left = parseInt(ring43.style.left) - 0 + 'px';
    ring44.style.left = parseInt(ring44.style.left) - 0 + 'px';
    ring45.style.left = parseInt(ring45.style.left) - 0 + 'px';
    ring46.style.left = parseInt(ring46.style.left) - 0 + 'px';
    ring47.style.left = parseInt(ring47.style.left) - 0 + 'px';
    ring48.style.left = parseInt(ring48.style.left) - 0 + 'px';
    ring49.style.left = parseInt(ring49.style.left) - 0 + 'px';
    ring50.style.left = parseInt(ring50.style.left) - 0 + 'px';

    spikes.style.left = parseInt(spikes.style.left) - 0 + 'px';
    spikes2.style.left = parseInt(spikes2.style.left) - 0 + 'px';
    spikes3.style.left = parseInt(spikes3.style.left) - 0 + 'px';
    spikes4.style.left = parseInt(spikes4.style.left) - 0 + 'px';
    spikes5.style.left = parseInt(spikes5.style.left) - 0 + 'px';

    eggman.style.left = parseInt(eggman.style.left) + 0 + 'px';
    x++;

}

function moveDie(){
    sonic.classList.add("died");
}

//anillos horizontales
function rings(value, clase){
    if(x==value){
        clase.classList.add("blink");
        var ringSound = new Audio('./audio/ringSound.mp3');
        ringSound.play();
        }
}

//anillos verticales
function ringsY(v1, v2, clase){
    if(y == 1){
        if(x>=v1 && x<=v2){
            clase.classList.add("blink");
            var ringSound = new Audio('./audio/ringSound.mp3');
            ringSound.play();}
        }
}

//contador de puntaje
function scoreR(value){
    if(x==value){
        score++;
        document.getElementById("puntaje").innerHTML = score;
        }
}

function scoreL(value){
    if(x==value){
        score--;
        }
}

function scoreY(v1,v2){
    if(y == 1){
        if(x>=v1 && x<=v2){
            score++;
            document.getElementById("puntaje").innerHTML = score;
        }
            }
}

var die = 0;
function lose(p1,p2){
    if(y == 1){
        if(x>=p1 && x<=p2){
            score++;
            sonic.classList.add("died");
            die++;

        }
            }
}

function ganar(v, clase){
    if(x==v){
        clase.classList.add("eggLoses");
        win.classList.add("mostrar");
        }
}

function repetir(v){
    if(x==v){
        alert("PRESS F5 TO PLAY AGAIN");
    }
}



//Eggman
function eggMan(){
    if(score >= 50){
        keepRuning.classList.add("keep2");
    }
    return;
}


//KEYDOWN

window.addEventListener('keydown', (e)=>{

    var jump = new Audio('./audio/jump.mp3');

    if(e.key == "ArrowRight"){
          runRight();
          song.play();
        sonic.classList.add("moving");
        sonic.classList.remove("sonic2");
        sonic.classList.add("sonic");
        background.classList.add("background2");
        eggman.classList.add("eggRun");
        eggman.classList.remove("eggman");
        y=0;
        if(die>0){
            morir.classList.add("mostrar");
            alert("PRESS F5 TO PLAY AGAIN");
        }

        
        
       // eggMan();
        scoreR(31);
        scoreR(35);
        scoreR(38);
        scoreR(41);
        scoreR(66);
        scoreR(69);
        scoreR(71);
        scoreR(74);
        scoreR(77);
        scoreR(80);
        scoreR(132);
        scoreR(135);
        scoreR(138);
        scoreR(141);
        scoreR(144);
        scoreR(165);
        scoreR(168);
        scoreR(171);
        scoreR(174);
        scoreR(177);
        scoreR(205);
        scoreR(208);
        scoreR(211);
        scoreR(214);
        scoreR(217);
        scoreR(220);
        scoreR(223);
        scoreR(226);
        scoreR(229);
        scoreR(232);
        scoreR(272);
        scoreR(275);
        scoreR(278);
        scoreR(281);
        scoreR(284);
        scoreR(287);
        scoreR(288);

        rings(31, ring);
        rings(35, ring2);
        rings(38, ring3);
        rings(41, ring4);
        rings(66, ring5);
        rings(69, ring6);
        rings(71, ring7);
        rings(74, ring8);
        rings(77, ring9);
        rings(80, ring10);
        rings(132, ring15);
        rings(135, ring16);
        rings(138, ring17);
        rings(141, ring18);
        rings(144, ring19);
        rings(165, ring24);
        rings(168, ring25);
        rings(171, ring26);
        rings(174, ring27);
        rings(177, ring28);
        rings(205, ring29);
        rings(208, ring30);
        rings(211, ring31);
        rings(214, ring32);
        rings(217, ring33);
        rings(220, ring34);
        rings(223, ring35);
        rings(226, ring36);
        rings(229, ring37);
        rings(232, ring38);
        rings(272, ring42);
        rings(275, ring43);
        rings(278, ring44);
        rings(281, ring45);
        rings(284, ring46);
        rings(287, ring47);
        rings(288, ring48);

        ganar(528, eggman2);
        repetir(531);

        if(score >= 50){
            eggman2.style.left = parseInt(eggman2.style.left) - moveBy + 'px';
        }
    }

        if(e.key == "ArrowLeft"){
             runLeft();
             y=0;

            sonic.classList.add("moving2");
            background.classList.add("background2");
            eggman.classList.add("eggRun");
            eggman.classList.remove("eggman");

            if(die>0){
                morir.classList.add("mostrar");
                alert("PRESS F5 TO PLAY AGAIN");
            }

        //eggMan();
        scoreL(31);
        scoreL(35);
        scoreL(38);
        scoreL(41);
        scoreL(66);
        scoreL(69);
        scoreL(71);
        scoreL(74);
        scoreL(77);
        scoreL(80);
        scoreL(132);
        scoreL(135);
        scoreL(138);
        scoreL(141);
        scoreL(144);
        scoreL(165);
        scoreL(168);
        scoreL(171);
        scoreL(174);
        scoreL(177);
        scoreL(205);
        scoreL(208);
        scoreL(211);
        scoreL(214);
        scoreL(217);
        scoreL(220);
        scoreL(223);
        scoreL(226);
        scoreL(229);
        scoreL(232);
        scoreL(272);
        scoreL(275);
        scoreL(278);
        scoreL(281);
        scoreL(284);
        scoreL(287);
        scoreL(288);

        if(score >= 50){
            eggman2.style.left = parseInt(eggman2.style.left) + moveBy + 'px';
            
        }
        }
            if(e.key == "ArrowUp"){                
            sonic.classList.add("jumping");
            y=1;
            
            jump.play();
            if(die>0){
                morir.classList.add("mostrar");
                alert("PRESS F5 TO PLAY AGAIN");
            }

            ringsY(36, 39, ring11);
            ringsY(101, 103, ring12);
            ringsY(104, 106, ring13);
            ringsY(107, 109, ring14);
            ringsY(166, 168, ring20);
            ringsY(169, 171, ring21);
            ringsY(178, 180, ring22);
            ringsY(181, 183, ring23);
            ringsY(264, 266, ring39);
            ringsY(268, 270, ring40);
            ringsY(272, 274, ring41);
            ringsY(305, 307, ring49);
            ringsY(311, 314, ring50);

        }

});



//KEYUP
window.addEventListener('keyup', (e)=>{
    if(e.key == "ArrowRight"){
    
        sonic.classList.remove("moving");
        background.classList.remove("background2");
        eggman.classList.add("eggman");}

        if(e.key == "ArrowLeft"){
            
            sonic.classList.remove("moving2");
            sonic.classList.remove("sonic");
            sonic.classList.add("sonic2");
            background.classList.remove("background2");
            eggman.classList.add("eggman");}

            if(e.key == "ArrowUp"){
                
                sonic.classList.remove("jumping");
                
                if(die > 0){
                    morir.classList.add("mostrar");
                }

            scoreY(36, 39);
            scoreY(101, 103);
            scoreY(104, 106);
            scoreY(107, 109);
            scoreY(166, 168);
            scoreY(169, 171);
            scoreY(178, 180);
            scoreY(181, 183);
            scoreY(264, 266);
            scoreY(268, 270);
            scoreY(272, 274);
            scoreY(305, 307);
            scoreY(311, 314);


            lose(172,177);
            lose(205,219);
            lose(275,280);

            eggMan();
            }
});

if(die>1){
    morir.classList.add("mostrar");
}

