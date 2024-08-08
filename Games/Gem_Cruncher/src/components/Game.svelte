<script>
  import Board from "./Board.svelte";
  import GameHeader from "./GameHeader.svelte";
  import GameFooter from "./GameFooter.svelte";
  import GameOverModal from "./GameOverModal.svelte";
  import game from "../store/game.store";

  function getInitialBoardSize() {
    const docWidth = document.body.clientWidth;
    const docHeight = document.body.clientHeight;
    let rows = 8;
    let columns = 7;

    if (docWidth >= 700) {
      columns = 10;
    } else if (docWidth >= 580) {
      columns = 8;
    }

    return {
      rows,
      columns
    };
  }

  const moves = 20;
  const { rows, columns } = getInitialBoardSize();

  game.init(rows, columns, moves);

  let showModal = false;
  let bestScore;
  let score;

  function handleGameOver(event) {
    score = $game.score;
    const prevBest = localStorage.getItem("best-score") || 0;
    const newBest = Math.max(score, parseInt(prevBest, 10));

    localStorage.setItem("best-score", newBest);
    bestScore = newBest;
    showModal = true;
  }

  function handlePlayAgain() {
    game.reset();
    showModal = false;
  }
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 1200px;
    max-height: 1000px;
    margin: 0 auto;
  }

  .please-rotate {
    color: white;
    padding: 40px 20px;
    border-radius: 20px;
    background: -webkit-linear-gradient(top, #ff5db1 0%, #ef017c 100%);
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    border: 4px solid white;
    width: 400px;
    text-align: center;
    font-size: 30px;
    display: none;
  }

  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape) {
    main {
      display: none;
    }

    .please-rotate {
      display: block;
    }
  }
</style>

<main>
  <GameHeader />
  <Board on:game-over={handleGameOver} />
  <GameFooter />
  <GameOverModal
    {score}
    {bestScore}
    visible={showModal}
    on:play-again={handlePlayAgain} />
</main>

<div class="please-rotate">Please rotate phone 😄</div>
