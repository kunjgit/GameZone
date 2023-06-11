/**
*	---------------------------------------------------
*	FE.CreateLayers
*	---------------------------------------------------
**/
FE.CreateLayers = function(game) {
	// intro screen
	game.introLayer = new MGE.DisplayObjectContainer();
	game.stage.addChild(game.introLayer);
	
	// menu screen
	game.menuLayer = new MGE.DisplayObjectContainer();
	game.menuLayer.visible = false;
	game.stage.addChild(game.menuLayer);
	
	// game screen
	game.gameLayer = new MGE.DisplayObjectContainer();
	game.gameLayer.visible = false;
	game.stage.addChild(game.gameLayer);
	
		// players container
		game.playersContainer = new MGE.DisplayObjectContainer();
		// game.playersContainer.visible = false;
		game.gameLayer.addChild(game.playersContainer);	
	
		// playground container
		game.playgroundContainer = new MGE.DisplayObjectContainer();
		// game.playgroundContainer.visible = false;
		game.gameLayer.addChild(game.playgroundContainer);
		
		// inventory container
		game.inventoryContainer = new MGE.DisplayObjectContainer();
		game.inventoryContainer.visible = false;
		game.gameLayer.addChild(game.inventoryContainer);
		
	// game over screen
	game.overLayer = new MGE.DisplayObjectContainer();
	game.overLayer.visible = false;		
	game.stage.addChild(game.overLayer);
}