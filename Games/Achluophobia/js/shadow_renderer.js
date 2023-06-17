
function draw_wall_shadow(x_coord, y_coord, from_x, from_y, shadow_depth) {
	//Get points
	var points = [ [from_x * SQUARE_WIDTH, from_y * SQUARE_WIDTH ],
			[from_x * SQUARE_WIDTH + SQUARE_WIDTH, from_y * SQUARE_WIDTH ],
			[from_x * SQUARE_WIDTH + SQUARE_WIDTH, from_y * SQUARE_WIDTH + SQUARE_WIDTH ],
			[from_x * SQUARE_WIDTH, from_y * SQUARE_WIDTH + SQUARE_WIDTH ] ];
	
	var actual_points = new Array();
	
	var dot_products = new Array();
	
	for (var i = 0; i < points.length; i++) {
		var j = (i < points.length - 1) ? i + 1 : 0;
			
		var light_vector_x = points[i][0] - x_coord;
		var light_vector_y = points[i][1] - y_coord;
			
		var nx = -(points[j][1] - points[i][1]);
		var ny = points[j][0] - points[i][0];
		
		var outcome = MathHelper.dotproduct([light_vector_x, light_vector_y], [nx, ny]);
		dot_products.push(outcome);
			
	}
	
	for(var i = 0; i < dot_products.length; i++) {
		var j = (i < dot_products.length - 1) ? i + 1 : 0;

		if (MathHelper.sign(dot_products[i]) == 1 && MathHelper.sign(dot_products[j]) == 1) {
			actual_points.push(points[j]);
		} else if (MathHelper.sign(dot_products[i]) == 1 && MathHelper.sign(dot_products[j]) != 1) {
			actual_points.push(points[j]);
			
			 var new_point_x = points[j][0] + (points[j][0] - x_coord) * shadow_depth;
			 var new_point_y = points[j][1] + (points[j][1] - y_coord) * shadow_depth;	
			 actual_points.push([new_point_x, new_point_y]);
			
		} else if (MathHelper.sign(dot_products[i]) != 1 && MathHelper.sign(dot_products[j]) == 1) {

			 var new_point_x = points[j][0] + (points[j][0] - x_coord) * shadow_depth;
			 var new_point_y = points[j][1] + (points[j][1] - y_coord) * shadow_depth;	
			 actual_points.push([new_point_x, new_point_y]);
			
			actual_points.push(points[j]);
		} 
	}
	
	if (actual_points.length != 0) {
		ctx.beginPath();
		ctx.moveTo(actual_points[0][0], actual_points[0][1]);
		for(var i = 1; i < actual_points.length; i++) {
			ctx.lineTo(actual_points[i][0], actual_points[i][1]);
				
		}
		ctx.closePath( );
		if (DEBUG) {
			ctx.fillStyle = "#FF00FF";
			ctx.strokeStyle = "#000000";
		} else {
			ctx.fillStyle = "#000000";
			ctx.strokeStyle = "#000000";
		}
		ctx.lineWidth = 2;
		ctx.fill();
		ctx.stroke();
	}
}

function draw_shadows() {
	var square = translateToSquare(player.x, player.y);
	var distanceFrom = (Math.ceil(playerSight.arc_length / SQUARE_WIDTH) + 1);
	var draw_shadow_depth = distanceFrom * SQUARE_WIDTH;
	
	var start_X = (square.x - distanceFrom < 0) ? 0 : square.x - distanceFrom;
	var start_Y = (square.y - distanceFrom < 0) ? 0 : square.y - distanceFrom;
	
	var stop_X = (square.x + distanceFrom > HOUSE_ROWS) ? HOUSE_ROWS : square.x + distanceFrom;
	var stop_Y = (square.y + distanceFrom > HOUSE_COLS) ? HOUSE_COLS : square.y + distanceFrom;
	
	for(var i = start_X; i < stop_X; i++) {
		for(var j = start_Y; j < stop_Y; j++) {
			if (i == DOOR_X && j == DOOR_Y) continue;
		
			if ((HOUSE_LAYOUT[i][j] == 0 && hasFreeAdjacent(i,j)) ||
				HOUSE_LAYOUT[i][j] == -1 ) {
				
				draw_wall_shadow(player.x, player.y, i, j, draw_shadow_depth);
			}
		}
	}
}