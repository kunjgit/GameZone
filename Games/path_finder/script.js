document.addEventListener("DOMContentLoaded", function() {
    const grid = document.getElementById("grid");
    const findPathButton = document.getElementById("findPathButton");
    const resetButton = document.getElementById("resetButton");
    const message = document.getElementById("message");
    const gridSize = 10;
    let gridArray = [];
    let start, end;

    // Initialize the grid
    function createGrid() {
        gridArray = [];
        grid.innerHTML = '';
        for (let row = 0; row < gridSize; row++) {
            const rowArray = [];
            for (let col = 0; col < gridSize; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", () => handleCellClick(cell));
                rowArray.push(cell);
                grid.appendChild(cell);
            }
            gridArray.push(rowArray);
        }
        setStartAndEndPoints();
        setObstacles();
    }

    function setStartAndEndPoints() {
        start = gridArray[0][0];
        start.classList.add("start");

        end = gridArray[gridSize - 1][gridSize - 1];
        end.classList.add("end");
    }

    function setObstacles() {
        for (let i = 0; i < 20; i++) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            const cell = gridArray[row][col];
            if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
                cell.classList.add("obstacle");
            }
        }
    }

    function handleCellClick(cell) {
        if (cell.classList.contains("start") || cell.classList.contains("end")) {
            return;
        }
        if (cell.classList.contains("obstacle")) {
            cell.classList.remove("obstacle");
        } else {
            cell.classList.add("obstacle");
        }
    }

    function findPath() {
        const queue = [{ cell: start, path: [start] }];
        const visited = new Set();
        visited.add(start);

        while (queue.length > 0) {
            const { cell, path } = queue.shift();
            if (cell === end) {
                highlightPath(path);
                message.textContent = "Path found!";
                return;
            }

            const neighbors = getNeighbors(cell);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor) && !neighbor.classList.contains("obstacle")) {
                    visited.add(neighbor);
                    queue.push({ cell: neighbor, path: [...path, neighbor] });
                }
            }
        }

        message.textContent = "No path found.";
    }

    function getNeighbors(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const neighbors = [];

        if (row > 0) neighbors.push(gridArray[row - 1][col]);
        if (row < gridSize - 1) neighbors.push(gridArray[row + 1][col]);
        if (col > 0) neighbors.push(gridArray[row][col - 1]);
        if (col < gridSize - 1) neighbors.push(gridArray[row][col + 1]);

        return neighbors;
    }

    function highlightPath(path) {
        for (const cell of path) {
            if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
                cell.classList.add("path");
            }
        }
    }

    function resetGrid() {
        createGrid();
        message.textContent = '';
    }

    findPathButton.addEventListener("click", findPath);
    resetButton.addEventListener("click", resetGrid);

    createGrid();
});