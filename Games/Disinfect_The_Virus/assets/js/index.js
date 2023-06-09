/*!
 * Jeferson Luckas - Disinfect the virus
 *
 * Copyright (c) 2020 Jeferson Luckas
 * Released under the MIT license
 * https://github.com/JefersonLucas/disinfect-the-virus/blob/master/LICENSE
 *
 */

// Inicia o Jogo

function iniciarJogo() {
	var nivel = document.getElementById("nivel").value;

	if (nivel === "") {
		alert("Selecione um ítem da lista.");
		return false;
	}
	else {
		window.location.href = "game.html?" + nivel;
	}
}