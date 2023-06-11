var colIs = "#ff0000", minTim = 60, sco = 0, goa = 5, staLev = 1, staSpe = 3, staChe = false, setPeo = 1, timInt;

function sta() {
    if(staLev < 6) {
        document.getElementById("staGam").style.display = "none";
        document.getElementById("gatGam").style.display = "block";
        if(staChe == false) { worMapWri(); }
        staChe = true;
        staSta();
    }
}

function dra() {
    var firCheA = document.getElementById("fir1").getContext("2d"); firOne(firCheA);
    var watCheA = document.getElementById("wat1").getContext("2d"); watOne(watCheA);
    var earCheA = document.getElementById("ear1").getContext("2d"); earOne(earCheA);
    var winCheA = document.getElementById("win1").getContext("2d"); winOne(winCheA);
    var firCheB = document.getElementById("fir2").getContext("2d"); firTwo(firCheB);
    var watCheB = document.getElementById("wat2").getContext("2d"); watTwo(watCheB);
    var earCheB = document.getElementById("ear2").getContext("2d"); earTwo(earCheB);
    var winCheB = document.getElementById("win2").getContext("2d"); winTwo(winCheB);
    var firCheC = document.getElementById("pan").getContext("2d"); firTwo(firCheC);
}

function staClo() {
    staLev++;
    sco = 0;
    document.getElementById("youSco").innerHTML = sco;
    document.getElementById("staGam").style.display = "block";
    document.getElementById("gatGam").style.display = "none";
    if(staLev == 6) {
        document.getElementById("staTel").innerHTML = "YOU SAVE 105 PEOPLE!";
        document.getElementById("des").style.display = "none";
    } else { document.getElementById("staTel").innerHTML = "STAGE " + staLev + "<br />" + "START"; }
}

function staSta() { theOne(); timInt = setInterval("timMin()", 1000); }

function timMin() {
    minTim--;
    document.getElementById("timSec").innerHTML = minTim;
    var gamDo = minTim % staSpe;
    if(minTim <= 0) {
        document.getElementById("timSec").innerHTML = "End";
        alert("Sorry, Please Retry");
        staLev--;
        minTim = 60;
        staClo();
        clearInterval(timInt);
        theOne();
    }
    if(gamDo == 0 && minTim != 0) { for(i = 0; i < setPeo; i++) { ranGat(); } }
}

function peoOne(ctx) { ctx.beginPath(); ctx.fillStyle = "#000000"; ctx.arc(50,25,25,0,2*Math.PI); ctx.moveTo(50,50); ctx.lineTo(25,100); ctx.lineTo(75,100); ctx.fill(); ctx.closePath(); }

function firOne(ctx) { ctx.beginPath(); ctx.fillStyle="#ff0000"; ctx.moveTo(30,100); ctx.lineTo(15,40); ctx.lineTo(35,50); ctx.lineTo(50,20); ctx.lineTo(60,60); ctx.lineTo(90,40); ctx.lineTo(70,100); ctx.fill(); ctx.closePath(); ctx.beginPath(); ctx.fillStyle="#ffff00"; ctx.moveTo(40,100); ctx.lineTo(25,70); ctx.lineTo(35,75); ctx.lineTo(45,50); ctx.lineTo(50,75); ctx.lineTo(70,65); ctx.lineTo(60,100); ctx.fill(); ctx.closePath(); }
function watOne(ctx) { ctx.beginPath(); ctx.fillStyle="#000000"; ctx.moveTo(50,20); ctx.lineTo(10,40); ctx.lineTo(20,40); ctx.lineTo(20,80); ctx.lineTo(80,80); ctx.lineTo(80,40); ctx.lineTo(90,40); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.fillStyle="#87ceeb"; ctx.fillRect(0,70,100,30); ctx.closePath(); }
function earOne(ctx) { ctx.beginPath(); ctx.strokeStyle = "#ffff00"; ctx.fillStyle = "#000000"; ctx.lineWidth="5"; ctx.arc(50,50,30,0,Math.PI*2); ctx.stroke(); ctx.fill(); ctx.closePath(); }
function winOne(ctx) { ctx.beginPath(); ctx.fillStyle="gray"; ctx.arc(25,70,20,0,Math.PI*2); ctx.arc(50,60,30,0,Math.PI*2); ctx.arc(85,65,15,0,Math.PI*2); ctx.fill(); ctx.font="bold 15px Ariel"; ctx.fillStyle="green"; ctx.fillText("FUMES",25,70); ctx.closePath(); }

function firTwo(ctx) { ctx.beginPath(); ctx.fillStyle="#ff0000"; ctx.font="bold 25px Ariel"; ctx.fillText("Calling",5,35); ctx.fillText("The",15,60); ctx.fillText("911!!",25,85); ctx.closePath(); ctx.fill(); }
function watTwo(ctx) { ctx.beginPath(); ctx.fillStyle="#D3A16E"; ctx.moveTo(8,18); ctx.lineTo(60,18); ctx.lineTo(83,41); ctx.lineTo(31,41); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(8,18); ctx.lineTo(8,67); ctx.lineTo(31,91); ctx.lineTo(84,91); ctx.lineTo(84,41); ctx.lineTo(31,41); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.fillStyle="#87CEEB"; ctx.moveTo(30,18); ctx.lineTo(51,42); ctx.lineTo(51,55); ctx.lineTo(63,56);ctx.lineTo(63,41); ctx.lineTo(43,17); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.fillStyle="#000000"; ctx.font="bold 10px Ariel"; ctx.fillText("package",35,70); ctx.closePath(); }
function earTwo(ctx) { ctx.beginPath(); ctx.lineWidth="5"; ctx.strokeStyle="yellow"; ctx.moveTo(10,90); ctx.lineTo(90,90); ctx.lineTo(50,30); ctx.closePath(); ctx.stroke(); ctx.strokeStyle="red"; ctx.beginPath(); ctx.moveTo(15,85); ctx.lineTo(85,85); ctx.lineTo(50,35); ctx.closePath(); ctx.stroke(); }
function winTwo(ctx) { ctx.beginPath(); ctx.fillStyle="#421010"; ctx.fillRect(42,45,16,50); ctx.fillStyle="#008000"; ctx.arc(25,40,20,0,Math.PI*2); ctx.arc(50,40,20,0,Math.PI*2); ctx.arc(75,40,20,0,Math.PI*2); ctx.fill(); ctx.closePath(); ctx.beginPath(); ctx.arc(50,20,20,0,Math.PI*2); ctx.fill(); ctx.closePath();}

function theOneHey(temId, colWha) {
    var fonChe = document.getElementById(temId);
    var ctx = fonChe.getContext("2d");
    fonChe.style.color = colWha;
    ctx.clearRect(0,0,100,100);
    
    if(colWha == "#000000") { peoOne(ctx);
    } else if(colWha == "#ff0000") { firOne(ctx);
    } else if(colWha == "#87ceeb") { watOne(ctx);
    } else if(colWha == "#ffff00") { earOne(ctx);
    } else if(colWha == "#008000") { winOne(ctx); }
}

function colToHex(col) {
    if (col.substr(0, 1) === '#') { return col; }
    
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(col);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);
    
    red = red.toString(16);
    if(red == 0) { red = "0" + red; }
    
    green = green.toString(16);
    if(green == 0) { green = "0" + green; }
    
    blue = blue.toString(16);
    if(blue == 0) { blue = "0" + blue; }
    
    return "#" + red + green + blue;
};

function cur(che) {
    che = "canPeo" + che;
    var cheOne = document.getElementById(che).style.color;
    cheOne = colToHex(cheOne);
    
    if(cheOne == colIs) {
        theOneHey(che, "#000000");
        document.getElementById("logBox").innerHTML = "You Save One!";
        sco = sco + 1;
        document.getElementById("youSco").innerHTML = sco;
        if(sco >= goa) {
            document.getElementById("logBox").innerHTML = "You Heal the World! We Like You";
            clearInterval(timInt);
            switch(staLev) {
                case 1: minTim = 60; goa = 10; staSpe = 2; setPeo = 1;staClo(); break;
                case 2: minTim = 60; goa = 20; staSpe = 1; setPeo = 1; staClo(); break;
                case 3: minTim = 60; goa = 30;staSpe = 1; setPeo = 2; staClo(); break;
                case 4: minTim = 60; goa = 40; staSpe = 1; setPeo = 2; staClo(); break;
                case 5: staClo(); alert("You Heal the whole World!"); break;
            }
        }
    } else { document.getElementById("logBox").innerHTML = "not enough one!"; }
}

function ranGat() {
    var perChe = "canPeo" + Math.floor(Math.random() * 7 +1);
    var colChe = Math.floor(Math.random() * 4 +1);
    switch(colChe) {
        case 1: colChe = "#ff0000"; break;
        case 2: colChe = "#87ceeb"; break;
        case 3: colChe = "#ffff00"; break;
        case 4: colChe = "#008000"; break;
    }
    theOneHey(perChe, colChe);
}

function keyChe() {
    var ctx = document.getElementById("pan").getContext("2d");
    ctx.clearRect(0,0,100,100);
    var keyIs = event.keyCode;
    switch(keyIs) {
        case 49: colIs = "#ff0000"; firTwo(ctx); break;
        case 50: colIs = "#87ceeb"; watTwo(ctx); break;
        case 51: colIs = "#ffff00"; earTwo(ctx); break;
        case 52: colIs = "#008000"; winTwo(ctx); break;
    }
}

function theOne() {
    for(i = 1; i <= 7; i++) { var temId = "canPeo" + i; theOneHey(temId, "#000000");}
    document.getElementById("goaSco").innerHTML = goa;
}

function worMapWri() {
    var ctx = document.getElementById("worMap").getContext("2d");
    ctx.strokeStyle = "white"; ctx.lineWidth = "15";
//ASIA
    ctx.beginPath(); ctx.moveTo(305,82); ctx.lineTo(211,142); ctx.lineTo(211,238); ctx.lineTo(296,360); ctx.lineTo(474,133); ctx.closePath(); ctx.stroke(); ctx.fillStyle = "#9b59b6"; ctx.fill();
//EUROPE
    ctx.beginPath(); ctx.moveTo(211,142); ctx.lineTo(211,238); ctx.lineTo(68,295); ctx.lineTo(110,230); ctx.lineTo(121,143); ctx.lineTo(164,168); ctx.closePath(); ctx.stroke(); ctx.fillStyle = "#2ecc71"; ctx.fill();
//MIDDLE EAST
    ctx.beginPath(); ctx.moveTo(211,238); ctx.lineTo(260,308); ctx.lineTo(212,349); ctx.lineTo(134,334); ctx.lineTo(129,271); ctx.closePath(); ctx.stroke(); ctx.fillStyle = "#1abc9c"; ctx.fill();
//AFRICA
    ctx.beginPath(); ctx.moveTo(212,349); ctx.lineTo(138,504); ctx.lineTo(111,403); ctx.lineTo(64,398); ctx.lineTo(67,322); ctx.closePath(); ctx.stroke(); ctx.fillStyle = "#d35400"; ctx.fill();
//NORTH AMERICA
    ctx.beginPath(); ctx.moveTo(489,133); ctx.lineTo(575,132); ctx.lineTo(736,47); ctx.lineTo(596,361); ctx.closePath(); ctx.stroke(); ctx.fillStyle = "#e67e22"; ctx.fill();
//SOUTH AMERICA
    ctx.beginPath(); ctx.moveTo(596,361); ctx.lineTo(722,417); ctx.lineTo(625,557); ctx.closePath(); ctx.stroke(); ctx.fillStyle = "#f1c40f"; ctx.fill();
//OCEANIA
    ctx.beginPath(); ctx.arc(364,491,40,0,Math.PI*2); ctx.closePath(); ctx.stroke(); ctx.fillStyle = "#16a085"; ctx.fill();
}
