/**
*	---------------------------------------------------
*	FE.Chessboard
*	---------------------------------------------------
**/
FE.Chessboard = function(cols, rows, size, stroke, colors) {
	var w = cols * size;
	var h = rows * size;
	var view = MGE.createCanvas(w + stroke, h + stroke);
	
	var border = new MGE.Rectangle(w + stroke, h + stroke).applyParams({
		anchorX: 0,
		anchorY: 0,
		fillStyle: '#FFFFFF'
	});
	border.render(view.context);
	
	var black = false;
	for (var i=0; i < rows; i++) {
		for (var j=0; j < cols; j++) {
			view.context.fillStyle = colors[black ? 1 : 0];
			view.context.fillRect(stroke / 2 + j * size, stroke / 2 + i * size, size, size);
			black = !black;		
		}
		if (cols % 2 == 0) {
			black = !black;
		}
	}
	
	MGE.Sprite.call(this, view.canvas.toDataURL("image/png"));
	
	MGE.removeCanvas(view.canvas);
};

FE.Chessboard.prototype = Object.create(MGE.Sprite.prototype);
FE.Chessboard.prototype.constructor = FE.Chessboard;