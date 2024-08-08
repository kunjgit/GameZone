<script>
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  export let visible = false;
  export let score = "";
  export let bestScore = "";

  const dispatch = createEventDispatcher();
</script>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    padding: 24px;
    display: none;
    justify-content: center;
    align-items: center;
  }

  .overlay.visible {
    display: flex;
  }

  .modal {
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
  }

  .title {
    font-size: 38px;
  }

  .score {
    font-size: 50px;
    margin: 18px 0;
  }

  .best-score {
    margin-bottom: 24px;
  }
</style>

<div class="overlay" class:visible>
  <div class="modal">
    <div class="title">Game Over</div>
    <div class="score">{score}</div>
    <div class="best-score">Best: {bestScore}</div>
    <Button on:click={() => dispatch('play-again')}>Play Again</Button>
  </div>
</div>
