/*!
 * Jeferson Luckas - Disinfect the virus
 *
 * Copyright (c) 2020 Jeferson Luckas
 * Released under the MIT license
 * https://github.com/JefersonLucas/disinfect-the-virus/blob/master/LICENSE
 *
 */

// Variáveis globais

let altura = largura = pontos = 0;
let vidas = 1;
let tempo = 30;
let tempoVirus = 1500;
let nivel = window.location.search;

// Recupera e estabelece o nível do jogo

nivel = nivel === "" ? window.location.href = "index.html" : nivel.replace("?" , "");

if (nivel === "normal") {
	tempoVirus = 1500;
	nivel = "no";
}
else if (nivel === "dificil") {
	tempoVirus = 1000;
	nivel = "di";
}
else if (nivel === "impossivel") {
	tempoVirus = 750;
	nivel = "im";
}

// Altura e largura do jogo

let ajustaTamanhoPalco = function() {
	altura = window.innerHeight;
	largura = window.innerWidth;
}

window.onresize = ajustaTamanhoPalco();

// Posição aleatória

function valorAleatorio(valor) {
	let aleatorio = Math.floor(Math.random() * valor);
	return aleatorio;
}

function posicaoAleatoria() {

	// Remover o vírus anterior
	
	if(document.getElementById("virus")) {
	
		document.getElementById("virus").remove();

		if (vidas > 3) {
			window.location.href = "game-over.html?" + nivel + "&" + pontos;
		}
		else {
			document.getElementById("v" + vidas).className = "coracao far fa-heart fa-lg";
			vidas++;
		}
	}

	let posicaoX = valorAleatorio(largura) - 90;
	let posicaoY = valorAleatorio(altura) - 90;

	// Posição do vírus não sumir no browser

	posicaoX = posicaoX < 0 ? 0 : posicaoX;
	posicaoY = posicaoY < 0 ? 0 : posicaoY;

	// Criando elementos HTML

	const virus = document.createElement("img");
	const classe = tamanhoAleatorio() +" "+ ladoAleatorio()
	virus.src = virusAleatorio();
	virus.className = classe;
	virus.style.left = `${posicaoX}px`;
	virus.style.top = `${posicaoY}px`;
	virus.style.position = "absolute";
	virus.id = "virus";

	virus.onclick = function() {

		pontos++;
		pontos = pontos < 10 ? pontos = "0"+pontos : pontos;
		document.getElementById("pontos").innerHTML = pontos;
		
		document.getElementById("virus").remove();
	}
	document.body.appendChild(virus);
}

// Tamanho aleatório

function tamanhoAleatorio() {

	let tamanho = valorAleatorio(3);

	switch(tamanho){
		case 0:
			return "tamanho-1";
		case 1:
			return "tamanho-2";
		case 2:
			return "tamanho-3";
	}
}

// Lado aleatório

function ladoAleatorio() {

	let lado = valorAleatorio(2);

	switch(lado) {
		case 0:
			return "lado-A";
		case 1:
			return "lado-B";
	}
}

// Vírus aleatório

function virusAleatorio() {	

	let virus = valorAleatorio(4);

	switch(virus){
		case 0:
			return "assets/img/virus-01.png";
		case 1:
			return "assets/img/virus-02.png";
		case 2:
			return "assets/img/virus-03.png";
		case 3:
			return "assets/img/virus-04.png";
	}
}

// Cronômetro

var cronometro = setInterval(function() {
	if (tempo < 0) {
		clearInterval(cronometro);
		clearInterval(criaVirus);
		window.location.href = "you-win.html?" + nivel + "&" + pontos;
	}
	else {
		if (tempo < 10) {
			tempo = "0"+tempo;
			let estiloCronometro = document.getElementById("cronometro");
			estiloCronometro.style.color = "#f44336";
			estiloCronometro.style.animationName = "piscar";
			estiloCronometro.style.animationDuration = "1s";
			estiloCronometro.style.animationIterationCount = "infinite";	
		}
		document.getElementById("tempo").innerHTML = tempo;
	}
	tempo--;
}, 1000);

// Intervalo de tempo para a chamada da função

var criaVirus = setInterval(
	function() {
		posicaoAleatoria();
	},
tempoVirus);
