const container = document.getElementById('puzzle-container');
let tiles = [];

function initTiles() {
    for (let i = 1; i <= 8; i++) {
        let tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = i;
        tile.onclick = () => moveTile(i);
        container.appendChild(tile);
        tiles.push(tile);
    }
    tiles.push(null);
}

function shuffleTiles() {
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    renderTiles();
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    const targetIndex = tiles.indexOf(tiles.find(t => t && t.textContent == index));
    if ([1, -1, 3, -3].includes(targetIndex - emptyIndex)) {
        [tiles[targetIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[targetIndex]];
        renderTiles();
    }
}

function renderTiles() {
    container.innerHTML = '';
    tiles.forEach(tile => {
        container.appendChild(tile || document.createElement('div'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTiles();
    shuffleTiles();
});
