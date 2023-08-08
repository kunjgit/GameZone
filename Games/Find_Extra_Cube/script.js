var LeftSide = document.getElementById('left');
var RightSide = document.getElementById('right');
var CubeStart = 5;
var level = 1;

const welcomeSound = new Audio();
welcomeSound.src = 'https://drive.google.com/uc?export=download&id=1mROFDnoIAhUf8M55lK89qVFABt38x5Ql';

const move = new Audio();
move.src = 'https://drive.google.com/uc?export=download&id=12RP85yJRXoihQbztaYTKMZ8g46dtZ5MI';

//generate the position
function GeneratePosition(max, min) {
    return Math.random() * (max - min) + min;
}

function GenerateCube(CubeNum) {
    clearFaces();
    var max = LeftSide.offsetWidth - 55;
    for (var i = 0; i < CubeNum; i++) {
        var el = document.createElement('div');
        el.setAttribute("class", "cube");
        el.style.left = GeneratePosition(max, 0) + "px";
        el.style.top = GeneratePosition(max, 0) + "px";
        LeftSide.appendChild(el);
    }
    CopyToRightSide();
}

function clearFaces() {
    while (LeftSide.firstChild) {
        LeftSide.removeChild(LeftSide.firstChild);
    }
    while (RightSide.firstChild) {
        RightSide.removeChild(RightSide.firstChild);
    }
}

function CopyToRightSide() {
    var LeftSideCubes = LeftSide.cloneNode(true);
    LeftSideCubes.removeChild(LeftSideCubes.lastChild);
    LeftSideCubes.removeAttribute("id");
    RightSide.appendChild(LeftSideCubes);
    MakeActions();
    LeftSideCubes = "";
}

function MakeActions() {
    var LastSquare = document.getElementById('left').lastChild;
    var status = document.getElementById('status');
    LastSquare.onclick = function nextLevel(event) {
        move.play();
        event.stopPropagation();
        CubeStart = CubeStart + 5;
        level += 1;
        status.innerHTML = "Level " + level;
        GenerateCubes();
    }
}

document.body.onclick = function bodyClick() {
    alert("Game Over! Your level is: " + level);
    CubeStart = 5;
    level = 1;
    clearFaces();

    if (confirm("Do you want to start over?")) {
        welcomeSound.play();
        GenerateCube(CubeStart);
    }
}

function GenerateCubes() {
    GenerateCube(CubeStart);
}

window.onload = function () {
    GenerateCubes();
}
