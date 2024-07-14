let largura = 0;
let altura = 0;
let vidas = 1;
let tempo = 30;

let criaMosquitoTempo = 2000;

let nivel = window.location.search;
nivel = nivel.replace('?', '');

if (nivel === 'normal') {
    criaMosquitoTempo = 2000;
} else if (nivel === 'dificil') {
    criaMosquitoTempo = 1500;
} else if (nivel === 'extremo') {
    criaMosquitoTempo = 1000;
} else if (nivel === 'insano') {
    criaMosquitoTempo = 750;
}

function ajustaTamanhoPalcoJogo() {
    altura = window.innerHeight;
    largura = window.innerWidth;
    console.log(largura, altura);
}

ajustaTamanhoPalcoJogo();

// Add background music
let backgroundMusic = new Audio('background.wav');
backgroundMusic.loop = true;
backgroundMusic.play();

let cronometro = setInterval(function() {
    tempo -= 1;
    if (tempo < 0) {
        clearInterval(cronometro);
        clearInterval(criaMosquito);
        window.location.href = 'vitoria.html';
    } else {
        document.getElementById('cronometro').innerHTML = tempo;
    }
}, 1000);

function posicaoRandomica() {
    if (document.getElementById('mosquito')) {
        document.getElementById('mosquito').remove();
        if (vidas > 3) {
            let gameOverSound = new Audio('game-over.mp3');
            gameOverSound.play();
            setTimeout(function() {
                window.location.href = 'fim_de_jogo.html';
            }, 2000); // Wait for 2 seconds to let the game over sound play
        } else {
            document.getElementById('v' + vidas).src = "img/coracao_vazio.png";
            vidas++;
        }
    }

    let posicaoX = Math.floor(Math.random() * largura) - 90;
    let posicaoY = Math.floor(Math.random() * altura) - 90;

    posicaoX = posicaoX < 0 ? 0 : posicaoX;
    posicaoY = posicaoY < 0 ? 0 : posicaoY;

    console.log(posicaoX, posicaoY);

    let mosquito = document.createElement('img');
    mosquito.src = 'img/mosca.png';
    mosquito.className = tamanhoAleatorio() + ' ' + ladoAleatorio();
    mosquito.style.left = posicaoX + 'px';
    mosquito.style.top = posicaoY + 'px';
    mosquito.style.position = 'absolute';
    mosquito.id = 'mosquito';
    mosquito.onclick = function() {
        let hitSound = new Audio('hit.mp3');
        hitSound.play();
        this.remove();
    };

    document.body.appendChild(mosquito);
}

function tamanhoAleatorio() {
    let classe = Math.floor(Math.random() * 3);
    switch (classe) {
        case 0:
            return 'mosquito1';
        case 1:
            return 'mosquito2';
        case 2:
            return 'mosquito3';
    }
}

function ladoAleatorio() {
    let classe = Math.floor(Math.random() * 2);
    switch (classe) {
        case 0:
            return 'ladoA';
        case 1:
            return 'ladoB';
    }
}

// Call posicaoRandomica at intervals based on the level
let criaMosquito = setInterval(posicaoRandomica, criaMosquitoTempo);
