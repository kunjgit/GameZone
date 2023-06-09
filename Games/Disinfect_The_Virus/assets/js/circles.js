/*!
 * Jeferson Luckas - Disinfect the virus
 *
 * Copyright (c) 2020 Jeferson Luckas
 * Released under the MIT license
 * https://github.com/JefersonLucas/disinfect-the-virus/blob/master/LICENSE
 *
 */

// Circulos animados
 
const ulCirculos = document.querySelector("ul.circulos");

for (let i = 0; i < 15; i++) {

	const li = document.createElement("li");

	const random = (min, max) =>  Math.random() * (max - min) + min;

	const tamanho = Math.floor(random(10, 120));
	const posicao = random(1,80);
	const delay = random(5, 0.1);
	const duracao = random(24, 12);

	li.style.width = `${tamanho}px`;
	li.style.height = `${tamanho}px`;
	li.style.bottom = `-${tamanho}px`;

	li.style.left = `${posicao}%`;
	li.style.animationDelay = `${delay}s`;
	li.style.animationDuration = `${duracao}s`;
	li.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()},${Math.random()})`;

	ulCirculos.appendChild(li);	
}