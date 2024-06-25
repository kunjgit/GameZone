var canvas, c, grid, check, mouseX, currSide = 0, gameOver = false;
var cols = 7, 
    rows = 6, 
    sides = ["blue", "darkred"],
    cellSize = 60, 
    cellGap = 10, 
    borderGap = 30,
    borderWidth = 10,
    winningLength = 4,
    backColor = "black";

function main() {
    grid = new Array(cols);
    for (var i = 0; i < grid.length; i++) grid[i] = new Array(rows);
    canvas = document.getElementById("canvas");
    c = canvas.getContext("2d");
    canvas.width = cols * (cellSize + cellGap) - cellGap + borderGap * 2;
    canvas.height = rows * (cellSize + cellGap) - cellGap + borderGap * 2;
    canvas.addEventListener("click", function(e) {
        mouseX = e.clientX - canvas.offsetLeft;
        place(mouseX, sides[currSide]);
        currSide = currSide == 0? 1 : 0;
    });
    init();
}

function init() {
    document.getElementById("pageTitle").innerHTML = "CONNECT " + winningLength + "&nbsp; - &nbsp;" + cols + " x " + rows;
    document.getElementById("tabTitle").innerHTML = "Connect " + winningLength;
    document.querySelector("canvas").style.borderRadius = (cellSize / 2 + borderGap + borderWidth) + "px";
    document.querySelector("canvas").style.borderWidth = borderWidth + "px";
    render();
}

function place(x, color) {
    if (!gameOver) {
        var col = Math.floor((mouseX / canvas.width) * cols);
        col = col >= cols? col - 1 : col;
        for (var i = grid[col].length - 1; i >= 0; i--) {
            if (grid[col][i] == undefined) {
                grid[col][i] = color;
				render();
                check.init(col, i);
				check.vertical(col, i, grid[col][i]);
				check.horizontal(col, i, grid[col][i]);
				check.diagonalNegative(col, i, grid[col][i]);
				check.diagonalPositive(col, i, grid[col][i]);
                break;
            }	
        }
    }
}

function render() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.lineWidth = 3;
    c.strokeStyle = "darkslategray";
	for (var i = 0; i < grid.length; i++) {
		for (var k = 0; k < grid[i].length; k++) {
			c.fillStyle = grid[i][k] == undefined? backColor : grid[i][k];
            c.beginPath();
            c.arc((cellSize + cellGap) * i + cellSize / 2 + borderGap, 
                (cellSize + cellGap) * k + cellSize / 2 + borderGap,
                cellSize / 2, 0, 2 * Math.PI);
            c.stroke();
            c.fill();
            c.closePath();
		}
	}
}

function renderChain(color) {
    if (check.chainPositions.length >= winningLength) {   
        c.lineWidth = cellSize / 11;
        c.strokeStyle = color;
        c.beginPath();
        c.moveTo((cellSize + cellGap) * check.chainPositions[0][0] + cellSize / 2 + borderGap, 
                 (cellSize + cellGap) * check.chainPositions[0][1] + cellSize / 2 + borderGap);
        for (var i = 1; i < check.chainPositions.length; i++) {
            var p = check.chainPositions[i];
            c.lineTo((cellSize + cellGap) * p[0] + cellSize / 2 + borderGap, 
                     (cellSize + cellGap) * p[1] + cellSize / 2 + borderGap);
        }
        c.stroke();
        c.closePath();
        c.strokeStyle = "white";
        for (var i = 0; i < check.chainPositions.length; i++) {
            c.beginPath();
            var p = check.chainPositions[i];
            c.arc((cellSize + cellGap) * p[0] + cellSize / 2 + borderGap, 
                (cellSize + cellGap) * p[1] + cellSize / 2 + borderGap,
                cellSize / 2.5, 0, 2 * Math.PI);
            c.stroke();
            c.closePath();
        }
    }
}

check = {
	chainPositions: new Array(),
    chain: 1,
    init: function(col, row) {
        this.chainPositions = [[col, row]];
    },
	vertical: function(col, row, color) {
		for (var i = 1; i < winningLength; i++) {
			if (row + i <= rows - 1) {
				if (grid[col][row + i] == color) this.chainPositions.push([col, row + i]);
                else break;	
			}
		}
		for (var i = 1; i < winningLength; i++) {
			if (row - i >= 0) {
				if (grid[col][row - i] == color) this.chainPositions.push([col, row - i]);
                else break;
			}
		}
        this.checkAndReset(color);
	},
	horizontal: function(col, row, color) {
		for (var i = 1; i < winningLength; i++) {
			if (col + i <= cols - 1) {
				if (grid[col + i][row] == color) this.chainPositions.push([col + i, row]);
				else break;
			}
		}
		for (var i = 1; i < winningLength; i++) {
			if (col - i >= 0) {
				if (grid[col - i][row] == color) this.chainPositions.push([col - i, row]);
				else break;
			}
		}
        this.checkAndReset(color);
	},
	diagonalNegative: function(col, row, color) {
		for (var i = 1; i < winningLength; i++) {
			if ((col + i <= cols - 1) && (row + i <= rows - 1)) {
				if (grid[col + i][row + i] == color) this.chainPositions.push([col + i, row + i]);
                else break;	
			}
		}
		for (var i = 1; i < winningLength; i++) {
			if ((col - i >= 0) && (row - i >= 0)) {
				if (grid[col - i][row - i] == color) this.chainPositions.push([col - i, row - i]);
                else break;	
			}
		}
        this.checkAndReset(color);
	},
	diagonalPositive: function(col, row, color) {
		for (var i = 1; i < winningLength; i++) {
			if ((col + i <= cols - 1) && (row - i >= 0)) {
				if (grid[col + i][row - i] == color) this.chainPositions.push([col + i, row - i]);
				else break;	
			}
		}
		for (var i = 1; i < winningLength; i++) {
			if ((col - i >= 0) && (row + i <= rows - 1)) {
				if (grid[col - i][row + i] == color) this.chainPositions.push([col - i, row + i]);
				else break;	
			}
		}
        this.checkAndReset(color);
	},
    checkAndReset: function(color) {
        if (this.chainPositions.length >= winningLength) {
            renderChain(color);
            alert(winningLength + " IN A ROW!\n" + (color.toString()).toUpperCase() + " WINS!");
            gameOver = true;
        }
        this.chainPositions.splice(1, this.chainPositions.length - 1);
    }
};