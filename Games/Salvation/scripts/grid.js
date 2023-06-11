// based on Emanuele Feronato's grid. Thx
// http://www.emanueleferonato.com/

FE.emptyItem = function() {
	this.value = -1;
}

FE.Grid = function(sizeX, sizeY, availableItems) {
	this.size = {
		x: sizeX,
		y: sizeY,
		available: availableItems
	};
	
	this.grid = [];
	
	this.initEmptyGrid();
	this.fillGrid();
}

FE.Grid.prototype = {
	// ----------------------------------------
	// initEmptyGrid
	// ----------------------------------------
	initEmptyGrid: function() {
		for (var i=0; i < this.size.y; i++) {
			this.grid[i] = new Array();
			for (var j=0; j < this.size.x; j++) {
				this.setEmpty(i, j);
			}
		}	
	},
	
	// ----------------------------------------
	// fillGrid
	// ----------------------------------------	
	fillGrid: function() {
		for (var i=0; i < this.size.y; i++) {
			for (var j=0; j < this.size.x; j++) {
				do {
					this.grid[i][j].value = this.size.available[Math.floor(Math.random() * this.size.available.length)];
				} 
				while (this.isStreak(i,j));
			}
		}
	},
	
	// ----------------------------------------
	// refillGrid
	// ----------------------------------------	
	refillGrid: function() {
		var newItems = [];
		
		for (var i=0; i < this.size.x; i++) {
			if (this.grid[0][i].value == -1) {
				this.setEmpty(0, i);
				this.grid[0][i].value = this.size.available[Math.floor(Math.random() * this.size.available.length)];

				var tmp = {
					row: 0,
					col: i
				};
				newItems.push(tmp);
			} 
		}	
		
		return newItems;
	},

	// ----------------------------------------
	// checkCombo
	// ----------------------------------------	
	checkCombo: function() {
		var count = 0;
		var comboRemove = [];
		
		for (var i=0; i < this.size.y; i++) {
			for (var j=0; j < this.size.x; j++) {
				if (j <= (this.size.x - 3) && (this.grid[i][j].value != -1) && this.grid[i][j].value == this.grid[i][j+1].value && this.grid[i][j].value == this.grid[i][j+2].value) {
					count++;
					var a = this.removeItems(i,j);
					if (a.length != 0) {
						for (var k in a) {
							var l = a[k];
							comboRemove.push(l);
						}
					}
				}
				if (i <= (this.size.y - 3) && (this.grid[i][j].value != -1) && this.grid[i][j].value == this.grid[i+1][j].value && this.grid[i][j].value == this.grid[i+2][j].value) {
					count++;
					var a = this.removeItems(i,j);
					if (a.length != 0) {
						for (var k in a) {
							var l = a[k];
							comboRemove.push(l);
						}
					}
				}		 	
			}
		}
		
		return {'count': count, 'removed': comboRemove};
	},
	
	// ----------------------------------------
	// swap
	// ----------------------------------------	
	swap: function(e1, e2) {
		var tmp = this.grid[e1.row][e1.col];
		this.grid[e1.row][e1.col] = this.grid[e2.row][e2.col];
		this.grid[e2.row][e2.col] = tmp;
	},	

	// ----------------------------------------
	// setEmpty
	// ----------------------------------------	
	setEmpty: function(row, col) {
		this.grid[row][col] = new FE.emptyItem();	
	}, 
	
	// ----------------------------------------
	// getItem
	// ----------------------------------------
	getItem:function(row, col) {
		return (this.grid[row][col].value);
	},
	
	// ----------------------------------------
	// setItem
	// ----------------------------------------
	setItem:function(row, col, value) {
		this.grid[row][col].value = value;
	},
	
	// ----------------------------------------
	// removeItems
	// ----------------------------------------
	removeItems:function(row, col) {
		var val = this.grid[row][col].value;
		var tmp = row;
		
		var removed = [];
		removed.push({'row':row, 'col':col, 'value':val});

		if (this.isVerticalStreak(row,col)) {
			while (tmp > 0 && this.grid[tmp - 1][col].value == val) {
				removed.push({'row':(tmp - 1), 'col':col, 'value': val});
				this.setEmpty(tmp - 1, col);
				tmp--;
			}
			
			tmp = row;

			while (tmp < (this.size.y - 1) && this.grid[tmp + 1][col].value == val) {
				removed.push({'row':(tmp + 1), 'col':col, 'value': val});
				this.setEmpty(tmp + 1, col);
				tmp++;
			}
		}
		
		if (this.isHorizontalStreak(row,col)) {
			tmp = col;
			while (tmp > 0 && this.grid[row][tmp - 1].value == val) {
				removed.push({'row':row, 'col':(tmp - 1), 'value': val});
				this.setEmpty(row, tmp - 1);
				tmp--;
			}
			
			tmp=col;
			while (tmp < (this.size.x - 1) && this.grid[row][tmp + 1].value == val) {
				removed.push({'row':row, 'col':(tmp + 1), 'value': val});
				this.setEmpty(row, tmp + 1);
				tmp++;
			}
		}
		this.setEmpty(row, col);
		
		return removed;
	},
	
	// ----------------------------------------
	// applyGravity
	// ----------------------------------------		
	applyGravity: function(arr) {
		var fellDown = [];
		for (var j=0; j < this.size.x; j++) {
			for (var i=(this.size.y - 1); i > 0; i--) {
				if (this.grid[i][j].value == -1 && this.grid[i - 1][j].value >= 0) {
					fellDown.push({'row': (i - 1), 'col':j});
					this.grid[i][j] = this.grid[i - 1][j];
					this.setEmpty(i - 1, j);
				}
			}
		}
		return fellDown;
	},
	
	// ----------------------------------------
	// isStreak
	// ----------------------------------------		
	isStreak: function(row,col) {
		return this.isVerticalStreak(row,col) || this.isHorizontalStreak(row,col);
	},
	
	// ----------------------------------------
	// isVerticalStreak
	// ----------------------------------------		
	isVerticalStreak: function(row,col)  {
		var val = this.grid[row][col].value;
		var streak = 0;
		var tmp = row;
		
		while (tmp > 0 && this.grid[tmp - 1][col].value == val) {
			streak++;
			tmp--;
		}
		
		tmp = row;
		while (tmp < (this.size.y - 1) && this.grid[tmp + 1][col].value == val) {
			streak++;
			tmp++;
		}

		return streak > 1;
	},
	
	// ----------------------------------------
	// isHorizontalStreak
	// ----------------------------------------		
	isHorizontalStreak: function(row,col) {
		var val = this.grid[row][col].value;
		var streak = 0;
		var tmp = col;
		
		while (tmp > 0 && this.grid[row][tmp - 1].value == val){
			streak++;
			tmp--;
		}
		
		tmp = col;
		while (tmp < (this.size.x - 1) && this.grid[row][tmp + 1].value == val) {
			streak++;
			tmp++;
		}
		
		return streak > 1;
	},

	// ----------------------------------------
	// getRow
	// ----------------------------------------		
	getRow: function(row) {
		var pieces = [];
		for (var i=0; i < this.size.x; i++) {
			pieces.push(this.grid[row][i]);
		}

		return pieces;	
	},
	
	// ----------------------------------------
	// debug
	// ----------------------------------------	
	debug: function(what) {
		var prop = what || 'value';
		var lines = [];
		
		for (var i=0; i < this.size.y; i++) {
			var line = "";
			var lineArray = this.getRow(i);
			for (var j=0; j < lineArray.length; j++) {
				line += lineArray[j][prop] + " ";
			}
			lines.push(line);
		}

		console.log("[Grid - debug]");
		for (var i in lines) {
			console.log(lines[i]);
		}
	}
}