'use strict';
/*	Siopa Engine
	Theoretically, all the generic parts of the game, for easy reuse in other projects.
	See index.html for an example of how all the custom HTML tags work together.
*/

// Creates an instance of the Siopa engine
// Pass in the ID of the scene block to start on
function Siopa(startID){
	var siopa = this;

	// The scene box contains the HTML of whatever scene is currently active
	this.sceneBox = document.createElement('div');
	this.sceneBox.id = 'sceneBox';
	document.body.appendChild(this.sceneBox);

	// The states object keeps track of various Boolean variables that are
	// turned on and off by Siopa <action> tags, and in turn affect which
	// actions show up in menus
	this.states = {};

	// This property is set on scene activation, so custom code can easily
	// get the current scene ID
	this.currentScene = null;
	
	// All click events are handled here
	document.body.addEventListener('click', function(event){
		// Get the element that was clicked on
		var element = event.target;

		// Always close the menu--if they clicked on a menu, the action will
		// be performed and the menu should disappear, and if they didn't,
		// close the menu because that's the GUI idiom we're following
		siopa.clearMenu();

		// If they clicked on an entity, bring up the menu of available actions
		if(element.tagName.toLowerCase() == 'entity'){
			var actions = element.getElementsByTagName('action');
			var menu = document.createElement('entityMenu');

			for(var i = 0; i < actions.length; i++){
				var action = actions[i];

				if(!siopa.isActionActive(action)){
					continue;
				}

				// Create the menu item
				var item = document.createElement('entityMenuItem');
				// Add the action as a property of the item, so it can be retrieved later
				item.action = action;
				item.innerHTML = action.innerHTML;
				menu.appendChild(item);
			}
			document.body.appendChild(menu);

			// Position the menu at click coordinate
			var menuRect = menu.getBoundingClientRect();
			menu.style.left = Math.floor(event.clientX - .5*menuRect.width) + 'px';
			menu.style.top = Math.floor(event.clientY) + 'px';

			// Keep track of the menu, so we can easily remove it later
			siopa.menu = menu;
		}

		// If they clicked on a menu item, perform the action associated with it
		if(element.tagName.toLowerCase() == 'entitymenuitem'){
			var action = element.action;

			// Code in the eval attribute gets executed (this should be safe, since it's
			// only code from our static HTML page, unless the engine user has done some
			// extra stuff that they should know what they're doing with)
			var evalCode = action.getAttribute('eval');
			if(evalCode){
				var result = eval(evalCode);
				if(result === false){
					return;
				}
			}

			// The show attribute specifies a name of an actionText element within the
			//current scene to display when the action is performed
			var show = action.getAttribute('show');
			var texts = siopa.sceneBox.getElementsByTagName('actionText');
			for(var i = 0; i < texts.length; i++){
				if(texts[i].getAttribute('name') == show){
					texts[i].style.display = 'block';
				}else{
					texts[i].style.display = 'none';
				}
			}

			// The turnon and turnoff attributes manipulate Boolean states of
			// custom variables, stored in the engine's "states" property, and
			// used to turn actions on and off
			var turnon = action.getAttribute('turnon');
			if(turnon){
				var ons = turnon.split(' ');
				for(var i = 0; i < ons.length; i++){
					siopa.states[ons[i]] = true;
				}
			}
			var turnoff = action.getAttribute('turnoff');
			if(turnoff){
				var offs = turnoff.split(' ');
				for(var i = 0; i < offs.length; i++){
					siopa.states[offs[i]] = false;
				}
			}
			// After we change states, we need to update our entities to reflect if
			// they have any currently available actions or not
			siopa.updateEntityColors();

			// The goto attribute activates the specified scene
			var to = action.getAttribute('goto');
			if(to){
				siopa.activateScene(to);
			}
		}
	});

	// Escape also closes the current menu
	document.body.addEventListener('keydown', function(event){
		if(event.keyCode == 27){
			siopa.clearMenu();
		}
	});

	// Activate the first scene
	this.activateScene(startID);
}

Siopa.prototype.activateScene = function(sceneID){
	// Grab the specified scene element, and copy its HTML into the scene box
	var scene = document.getElementById(sceneID);
	this.sceneBox.innerHTML = scene.innerHTML;
	this.currentScene = sceneID;
	// Update the scene's entities to reflect what actions are available
	this.updateEntityColors();
	// Also clear the current menu, in case the scene was activated in some
	// other ways besides clicking a menu (i.e. custom code)
	this.clearMenu();
};

Siopa.prototype.isActionActive = function(action){
	// An action can require certain Boolean variables (stored in the engine's
	// "states" property) to be on or off before appearing in a menu
	// This function checks that
	var on = action.getAttribute('on');
	if(on && !this.states[on]){
		return false;
	}
	var off = action.getAttribute('off');
	if(off && this.states[off]){
		return false;
	}
	return true;
}

Siopa.prototype.updateEntityColors = function(){
	// Go through all the entities in the scene, and make them appear clickable
	// if they have actions currently active (see above), or not if the don't
	var entities = this.sceneBox.getElementsByTagName('entity');
	for(var i = 0; i < entities.length; i++){
		var entity = entities[i];
		var actions = entity.getElementsByTagName('action');
		var active = false;
		for(var j = 0; j < actions.length; j++){
			var action = actions[j];
			if(this.isActionActive(action)){
				active = true;
				break;
			}
		}
		// The "inactive" CSS class makes the entity appear to be regular text
		if(active){
			entity.className = '';
		}else{
			entity.className = 'inactive';
		}
	}
}

Siopa.prototype.clearMenu = function(){
	// Removes the menu, if it exists
	if(this.menu){
		// Band-aid. This seems to crash on scene end sometimes.
		// I *might* have fixed it, but leaving this hear so it doesn't
		// crash during the competition...
		try{
			document.body.removeChild(this.menu);
		}catch(err){}
		this.menu = null;
	}
};
