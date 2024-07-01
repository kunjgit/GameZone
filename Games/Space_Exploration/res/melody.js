/*global music*/
(function () {
"use strict";

var cMajor, eFlatMajor,
	jupiter11, jupiter12, jupiter21, jupiter22, jupiter, jupiterVariant,
	neptune1, neptune2, neptune;

/*jshint quotmark: false*/
//jscs:disable validateQuoteMarks
cMajor = {
	'D,': Math.pow(2, -19 / 12) * 440,
	'E,': Math.pow(2, -17 / 12) * 440,
	'F,': Math.pow(2, -16 / 12) * 440,
	'G,': Math.pow(2, -14 / 12) * 440,
	'A,': 0.5 * 440,
	'B,': Math.pow(2, -10 / 12) * 440,
	C: Math.pow(2, -9 / 12) * 440,
	D: Math.pow(2, -7 / 12) * 440,
	'^D': Math.pow(2, -6 / 12) * 440,
	E: Math.pow(2, -5 / 12) * 440,
	F: Math.pow(2, -4 / 12) * 440,
	G: Math.pow(2, -2 / 12) * 440,
	'^G': Math.pow(2, -1 / 12) * 440,
	A: 440,
	'_B': Math.pow(2, 1 / 12) * 440,
	B: Math.pow(2, 2 / 12) * 440,
	c: Math.pow(2, 3 / 12) * 440,
	'^c':  Math.pow(2, 4 / 12) * 440,
	d: Math.pow(2, 5 / 12) * 440,
	'^d': Math.pow(2, 6 / 12) * 440,
	'_e': Math.pow(2, 6 / 12) * 440,
	e: Math.pow(2, 7 / 12) * 440,
	f: Math.pow(2, 8 / 12) * 440,
	'_g':  Math.pow(2, 9 / 12) * 440,
	g: Math.pow(2, 10 / 12) * 440,
	'^g': Math.pow(2, 11 / 12) * 440,
	a: 2 * 440,
	'_b': Math.pow(2, 13 / 12) * 440,
	b: Math.pow(2, 14 / 12) * 440,
	"c'": Math.pow(2, 15 / 12) * 440,
	"d'": Math.pow(2, 17 / 12) * 440,
	"^d'": Math.pow(2, 18 / 12) * 440,
	"_e'": Math.pow(2, 18 / 12) * 440,
	"e'": Math.pow(2, 19 / 12) * 440,
	"f'": Math.pow(2, 20 / 12) * 440,
	"g'": Math.pow(2, 22 / 12) * 440
};
eFlatMajor = { //NOTE one octave lower than usual
	E: Math.pow(2, -6 / 12) * 220,
	F: Math.pow(2, -4 / 12) * 220,
	G: Math.pow(2, -2 / 12) * 220,
	A: Math.pow(2, -1 / 12) * 220,
	B: Math.pow(2, 1 / 12) * 220,
	c: Math.pow(2, 3 / 12) * 220,
	d: Math.pow(2, 5 / 12) * 220,
	e: Math.pow(2, 6 / 12) * 220,
	f: Math.pow(2, 8 / 12) * 220,
	g: Math.pow(2, 10 / 12) * 220,
	a: Math.pow(2, 11 / 12) * 220,
	b: Math.pow(2, 13 / 12) * 220,
	"c'": Math.pow(2, 15 / 12) * 220,
	"d'": Math.pow(2, 17 / 12) * 220,
	"e'": Math.pow(2, 18 / 12) * 220,
	"f'": Math.pow(2, 20 / 12) * 220,
	"g'": Math.pow(2, 22 / 12) * 220
};

/*
The format is based on ABC. To convert into real ABC, do the following:
* Replace all fractional numbers by fractions.
* Where notes are separated by spaces, add the lenght after each note and enclose them in square brackets.
* Move the correct octave.
* Add the metadata (especially the key, here denoted by "x").
*/

//jscs:disable maximumLineLength
jupiter11 = "x0 z A0.25 c0.25 d0.25 A0.25 e0.25 g0.25 a0.25 e0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 a0.25 c'0.25 d'0.25 z ebe'3 Acg0.5 Acf FAc FAe0.5 FAd DFc0.5 DFB0.5 DFA0.5 DFG0.5 Gg cd Gg cd Gg cd Gg cd Ff _Bc Ff _Bc Ff _Bc Ff _Bc z2";
jupiter12 = "x2 G0.5 B0.5 c c0.5 e0.5 d0.75 B0.25 e0.5 f0.5 e Bd c0.5 d0.5 c B G2 G0.5 B0.5 c c0.5 e0.5 d0.75 B0.25 e0.5 f0.5 g Bg cg0.5 f0.5 e cf e2 b0.5 g0.5 f f e0.5 g0.5 f B b0.5 g0.5 f f g0.5 b0.5 c'2 c'0.5 d'0.5 c'e' bd' ac' gb ee' eg f0.5 e0.5 f g fb2 eg0.5 b0.5 ec' c'0.5 e'0.5 fd'0.75 b0.25 be'0.5 f'0.5 e' bd' c'0.5 d'0.5 c' db eg2 g0.5 b0.5 c' c'0.5 e'0.5 d'0.75 b0.25 e'0.5 f'0.5 g' gg' g'0.5 f'0.5 e' af' ge'2 b0.5 g0.5 f f e0.5 g0.5 f B b0.5 g0.5 f f g0.5 b0.5 c'2 c'0.5 d'0.5 c'e' bd' ac' gb ee' eg f0.5 e0.5 f g fb2 eg0.5 b0.5 ec' c'0.5 e'0.5 fd'0.75 b0.25 be'0.5 f'0.5 e' bd' c'0.5 d'0.5 c' db eg2 g0.5 b0.5 c' c'0.5 e'0.5 d'0.75 b0.25 e'0.5 f'0.5 g' gg' g'0.5 f'0.5 e' af'3";
jupiter21 = "x1 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 A0.5 B G B0.5 A B0.25 c0.25 A0.25 B0.25 c0.75 G1.25 B0.5 A0.5 G0.25 A0.25 c0.25 e0.25 g0.75 g0.25 a0.5 b g z0.5 CGc e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 e0.25 g0.25 a0.25 A,A0.5 B,B G,G B,B0.5 A,A B,B0.25 Cc0.25 A,A0.25 B,B0.25 Cc0.75 G,G1.25 B,B0.5 A,A0.5 G,G0.25 A,A0.25 Cc0.25 Ee0.25 Gg0.75 Gg0.25 Aa0.5 Bb Gg0.5 z ^GBe^g3 D,D0.5 E,E F,F A,A0.5 B,B Dd0.5 Ee0.5 Ff0.5 Gg0.5 G0.5 c0.5 f G0.5 c0.5 f G0.5 c0.5 f0.5 g0.5 d2 F0.5 _B0.5 _e F0.5 _B0.5 _e F0.5 _B0.5 _e0.5 f0.5 c2 G0.5 _B0.5 c";
jupiter22 = "x2 z Ae z Bf Ge z Ge Ae z Bd ce2 Bd Ae z Bf Ge z E0.5 G0.5 Ae z ca z eg Ge Bf z cg db z Ge Bf z eb a g fa cg Bg Ae Ge Fe Ee Af fa eb d c B Ae z Bf Ge z Ge Ae z Bf ce2 Bd Ae z Bf Ge z E0.5 G0.5 Ae z ca Eg2 Ge Bf z cg db z Ge Bf z eb a g fa cg Bg Ae Ge Fe Ee Af fa eb d c B Ae z Bf Ge z Ge Ae z Bf ce2 Bd Ae z Bf Ge z E0.5 G0.5 Ae z ca3";

neptune1 = "x0 G E G0.5 E0.5 ^D0.5 ^G0.5 B0.5 ^G0.5 G E G0.5 E0.5 ^D0.5 ^G0.5 B0.5 ^c0.5 B^d0.5 ^d^g0.5 ^gb^d'4 ac'e' fac' ac'e' ^gb^d'2 z10 B^d0.5 ^d^g0.5 ^gb^d'4 gc'e' egc' gc'e' _g_bc'_e'2";
neptune2 = "x0 B G B0.5 G0.5 ^G0.5 B0.5 ^d0.5 ^c0.5 B G B0.5 G0.5 ^G0.5 B0.5 ^d0.5 ^g0.5 z3 A,Ec5 z2 Bg Ge Bg0.5 Ge0.5 ^G^d0.5 B^g0.5 db0.5 ^c^g0.5 B^g Ge Bg0.5 Ge0.5 ^G^d0.5 B^G0.5 db0.5 g^c0.5 z3 CGce4 z3";
//jscs:enable maximumLineLength

jupiter = {
	defs: [
		{
			key: cMajor,
			volume: 0.02,
			baseDur: 60 / 100
		},
		{
			key: cMajor,
			volume: 0.2,
			baseDur: 60 / 100
		},
		{
			key: eFlatMajor,
			volume: 0.2,
			baseDur: 60 / 80
		}
	],
	staffs: [
		[jupiter11 + ' ' + jupiter12],
		[jupiter21 + ' ' + jupiter22, 0.5]
	]
};

jupiterVariant = {
	defs: [
		{
			key: cMajor,
			volume: 0.02,
			baseDur: 60 / 100
		},
		{
			key: cMajor,
			volume: 0.2,
			baseDur: 60 / 100
		},
		{
			key: eFlatMajor,
			volume: 0.2,
			baseDur: 60 / 80
		}
	],
	staffs: [
		[jupiter12 + ' ' + jupiter11],
		[jupiter22 + ' ' + jupiter21, 0.5]
	]
};

neptune = {
	defs: [
		{
			key: cMajor,
			volume: 0.2,
			baseDur: 1
		}
	],
	staffs: [
		[neptune1, 0.5],
		[neptune2, 0.25]
	]
};

music.setMelody = function (n) {
	switch (n) {
	case 0:
	case 3:
		music.init(jupiterVariant);
		break;
	case 1:
	case 4:
		music.init(neptune);
		break;
	case 2:
		music.init(jupiter);
	}
};

})();