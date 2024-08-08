<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import Tile from "./Tile.svelte";
  import game from "../store/game.store";
  import { areTilesAdjacent, getMatches } from "../store/game.utils";

  const BOARD_PADDING = 10;
  const dispatch = createEventDispatcher();
  const matchSound = new Audio("/assets/match.wav");

  let docWidth = document.body.clientWidth;
  let tileSize = getTileSize($game.columns);

  function getTileSize(columns) {
    docWidth = document.body.clientWidth;
    let minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 60;
    if (docWidth >= minWdth) {
      return 60;
    }

    minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 50;
    if (docWidth >= minWdth) {
      return 50;
    }

    minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 40;
    if (docWidth >= minWdth) {
      return 40;
    }

    minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 30;
    if (docWidth >= minWdth) {
      return 30;
    }

    minWdth = BOARD_PADDING * 2 + 40 * 2 + columns * 20;
    if (docWidth >= minWdth) {
      return 20;
    }

    return 10;
  }

  $: board = $game.board;
  $: rows = $game.rows;
  $: columns = $game.columns;
  $: cells = [...Array(board.length).keys()];
  $: selectedTile = null;
  $: isTileSelected = i => selectedTile === i;
  $: getCellStyle = i => {
    const row = Math.floor(i / columns);
    const col = i % columns;

    return `
      top: ${tileSize * row + BOARD_PADDING}px;
      left: ${tileSize * col + BOARD_PADDING}px;
    `;
  };
  $: boardStyle = `
    width: ${tileSize * columns + BOARD_PADDING * 2}px;
    height: ${tileSize * rows + BOARD_PADDING * 2}px;
    --tile-size: ${tileSize}px;
  `;

  function swapTiles(p, q) {
    game.swapTiles(p, q);
    setTimeout(() => {
      const matches = getMatches(board, rows, columns);
      if (matches.length === 0) {
        game.swapTiles(p, q);
      } else {
        game.decrementMoves();
        game.resolveBoard(
          () => {
            matchSound.currentTime = 0;
            matchSound.play();
          },
          () => {
            if ($game.moves === 0) {
              dispatch("game-over", {
                score: $game.score
              });
            }
          }
        );
      }
    }, 250 - 50);
    selectedTile = null;
  }

  function handleTileClick(i) {
    if (isTileSelected(i)) {
      return (selectedTile = null);
    }

    if (selectedTile === null) {
      return (selectedTile = i);
    }

    if (!areTilesAdjacent(selectedTile, i, columns)) {
      return (selectedTile = null);
    }

    swapTiles(selectedTile, i);
  }

  function handleSwipe(event) {
    const { direction, index } = event.detail;
    switch (direction) {
      case "left":
        // can't swipe left from first column
        if (index % columns === 0) {
          return;
        }
        return swapTiles(index, index - 1);
      case "right":
        // can't swipe right from last column
        if (index % columns === columns - 1) {
          return;
        }
        return swapTiles(index, index + 1);
      case "up":
        // can't swipe up from first row
        if (index < columns) {
          return;
        }
        return swapTiles(index, index - columns);
      case "down":
        // can't swipe down from last row
        if (index + columns >= board.length) {
          return;
        }
        return swapTiles(index, index + columns);
      default:
        return;
    }
  }

  onMount(() => {
    window.addEventListener("resize", () => {
      requestAnimationFrame(() => {
        const newTileSize = getTileSize($game.columns);
        if (newTileSize !== tileSize) {
          tileSize = newTileSize;
        }
      });
    });
  });
</script>

<style>
  main {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .board {
    position: relative;
    margin: 0 auto;
    background: rgba(0, 53, 103, 0.5);
    box-shadow: inset 0 0 8px rgba(0, 53, 103, 1);
    border-radius: 5px;
  }

  .cell {
    position: absolute;
    width: var(--tile-size);
    height: var(--tile-size);
    pointer-events: none;
  }

  .cell.is-selected {
    background-image: url(/assets/target.svg);
    animation: pulse 1.2s infinite;
  }

  .tile-wrapper {
    position: absolute;
    width: var(--tile-size);
    height: var(--tile-size);
  }

  @keyframes pulse {
    0% {
      transform: scale(1.15);
    }

    50% {
      transform: scale(1.3);
    }

    100% {
      transform: scale(1.15);
    }
  }
</style>

<main>
  <div class="board" style={boardStyle}>
    {#each board as tile, i (tile.id)}
      <span
        class="tile-wrapper"
        animate:flip={{ delay: 0, duration: 250, easing: quintOut }}
        style={getCellStyle(i)}>
        {#if tile.type !== null}
          <Tile
            type={tile.type}
            special={tile.special}
            size={tileSize}
            index={i}
            on:click={() => handleTileClick(i)}
            on:swipe={handleSwipe}
            selected={isTileSelected(i)} />
        {/if}
      </span>
    {/each}
    {#each cells as cell, i}
      <div
        class="cell"
        class:is-selected={isTileSelected(i)}
        style={getCellStyle(cell)} />
    {/each}
  </div>
</main>
