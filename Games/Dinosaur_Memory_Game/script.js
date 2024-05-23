const board = document.querySelector('.board');
const clone = document.querySelector('.clone');
const overlay = document.querySelector('.overlay');
const reset = document.querySelector('.reset');
const tileOptions = ['erupt', 'ptero', 'tri', 'ahahah', 'egg', 'dino'];

const state = {
  selections: [],
  boardLocked: false,
  matches: 0
};

reset.addEventListener('click', () => {
  if (state.boardLocked) return;
  resetGame();
});

function resetGame() {
  state.boardLocked = true;
  state.selections = [];
  state.matches = 0;

  document.querySelectorAll('.cube').forEach(tile => {
    tile.removeEventListener('click', () => selectTile(tile));
    tile.remove();
  });

  overlay.classList.add('hidden');
  createBoard();
}

function createBoard() {
  const tiles = shuffleArray([...tileOptions, ...tileOptions]);
  const length = tiles.length;

  for (let i = 0; i < length; i++) {
    window.setTimeout(() => {
      board.appendChild(buildTile(tiles.pop(), i));
    }, i * 100);
  }

  window.setTimeout(() => {
    document.querySelectorAll('.cube').forEach(tile => {
      tile.addEventListener('click', () => selectTile(tile));
    });

    state.boardLocked = false;
  }, tiles.length * 100);
}

function buildTile(option, id) {
  const tile = clone.cloneNode(true);
  tile.classList.remove('clone');
  tile.classList.add('cube');
  tile.setAttribute('data-tile', option);
  tile.setAttribute('data-id', id);
  return tile;
}

function selectTile(selectedTile) {
  if (state.boardLocked || selectedTile.classList.contains('flipped')) return;

  state.boardLocked = true;

  if (state.selections.length <= 1) {
    selectedTile.classList.add('flipped');
    state.selections.push({
      id: selectedTile.dataset.id,
      tile: selectedTile.dataset.tile,
      el: selectedTile
    });
  }

  if (state.selections.length === 2) {
    if (state.selections[0].tile === state.selections[1].tile) {
      window.setTimeout(() => {
        state.selections[0].el.classList.add('matched');
        state.selections[1].el.classList.add('matched');
        
        state.boardLocked = false;
        state.matches = state.matches + 1;
        
        if (state.matches === tileOptions.length) {
          window.setTimeout(() => {
            overlay.classList.remove('hidden');
            document.querySelector('.audio-win').play();
          }, 600);
        }
        state.selections = [];
        document.querySelector(`.audio-${selectedTile.dataset.tile}`).play();
      }, 600);
    } else {
      setTimeout(() => {
        document.querySelectorAll('.cube').forEach(tile => {
          tile.classList.remove('flipped');
        });
        state.boardLocked = false;
      }, 800);
      state.selections = [];
    }
  } else {
    state.boardLocked = false;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

createBoard();