/*!
 * Jeferson Luckas - Disinfect the virus
 *
 * Copyright (c) 2020 Jeferson Luckas
 * Released under the MIT license
 * https://github.com/JefersonLucas/disinfect-the-virus/blob/master/LICENSE
 *
 */

// Recupera o resultado do jogo e mostra para o jogador

let resultado = window.location.search;

if(resultado === "") {
	window.location.href = "index.html";
}
else {
	resultado.replace("?" , "");

	let nivel = resultado.substr(1,2);
	const pontos = resultado.substr(4,2);

	if (nivel === "no") {
		nivel = "Normal";
	}
	else if (nivel === "di") {
		nivel = "Difícil";
	}
	else if (nivel === "im") {
		nivel = "Impossível";
	}

	confirm("Seu resultado\nDificuldade: " + nivel +"\nPotuação: " + pontos);
}

// Redirecionamento

var reiniciar = document.getElementById("reiniciar");

if (reiniciar) {
	document.getElementById("reiniciar").onclick = function() {
	window.location.href = "index.html";
	}
}

