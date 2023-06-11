'use strict';
/*	Siopa custom code
	Custom scripts specifically for Siopa, separate from the generic engine.
*/

// Engine reference
var siopa;

function load(){
	// Create new instance of the engine
	siopa = new Siopa('start');
}
if(window.addEventListener){
	window.addEventListener('load', load)
}else if(window.attachEvent){
	window.attachEvent('onload', load);
}

// The following beginX functions handle the set up of each individual element section
// They all take one argument, a Boolean indicating whether the player should
// die or live in the section that's beginning
// They also all set a timer for when the player meets said fate

function beginAir(save){
	var suffix = 'Death';
	if(save){
		suffix = 'Life';
	}
	siopa.activateScene('livingRoom');
	setTimeout(function(){
		if(siopa.currentScene ==='porch'){
			siopa.activateScene('outside' + suffix);
		}else if(siopa.currentScene === 'stormShelter'){
			siopa.activateScene('shelter' + suffix);
		}else{
			siopa.activateScene('inside' + suffix);
		}
	}, 1000*60);
}

function beginWater(save){
	var suffix = 'Death';
	if(save){
		suffix = 'Life';
	}
	siopa.activateScene('onDeck');
	setTimeout(function(){
		if(siopa.currentScene === 'onDeck'){
			siopa.activateScene('onDeck' + suffix);
		}else{
			siopa.activateScene('belowDeck' + suffix);
		}
	}, 1000*60);
}

// Fire also includes the explodeJeep function, which ends the section immediately
// once the player drives away in the jeep, so there's a little extra stuff here
var fireTimer;
var fireSave;
function beginFire(save){
	var suffix = 'Death';
	if(save){
		suffix = 'Life';
	}
	fireSave = save;
	siopa.activateScene('inTent');
	fireTimer = setTimeout(function(){
		if(siopa.currentScene === 'driving'){
			siopa.activateScene('jeep' + suffix);
		}else{
			siopa.activateScene('smoke' + suffix);
		}
	}, 1000*60);
}
function explodeJeep(){
	clearTimeout(fireTimer);
	if(!fireSave){
		siopa.activateScene('jeepDeath');
	}else{
		siopa.activateScene('jeepLife');
	}
}

function beginEarth(save){
	var suffix = 'Death';
	if(save){
		suffix = 'Life';
	}
	siopa.activateScene('inCubical');
	setTimeout(function(){
		if(siopa.currentScene === 'inCubical' || siopa.currentScene === 'hallway'){
			siopa.activateScene('inOffice' + suffix);
		}else{
			siopa.activateScene('outsideOffice' + suffix);
		}
	}, 1000*60);
}

// Called upon complettion of a section, and updates the player's overall
// progress through the game
function complete(element){
	siopa.states[element + 'Complete'] = true;
	siopa.states['completedOne'] = true;
	
	if(siopa.states['airComplete']
			&& siopa.states['waterComplete']
			&& siopa.states['fireComplete']
			&& siopa.states['earthComplete']){
		siopa.activateScene('selectionFinal');
	}else{
		document.getElementById('prompt').innerHTML = 'Select another element:'
		siopa.activateScene('selection');
	}
}
