<script>
  import LevelTarget from "./LevelTarget.svelte";
  import game from "../store/game.store";
</script>

<style>
  header {
    background-image: -webkit-linear-gradient(top, #fec966, #ff9d2e);
    border-radius: 16px;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3), inset 0px 2px 0px #fff,
      inset 0px -2px 3px #a55208;
    padding: 10px;
    display: flex;
  }

  .group {
    text-align: center;
    width: 80px;
    margin-left: 10px;
  }

  .group:first-child {
    margin-left: 0;
  }

  .group.target {
    flex: 1;
  }

  .group.score {
    width: 160px;
  }

  .group-label {
    color: #fff;
    text-transform: uppercase;
    text-shadow: 1px 1px 1px #a55208;
    margin-bottom: 5px;
    letter-spacing: 1px;
    font-size: 16px;
  }

  .group-value {
    height: 60px;
    background-image: -webkit-linear-gradient(top, #ed7000, #be5c04);
    border-radius: 16px;
    box-shadow: inset 0px 2px 3px #a55208, 0px 2px 2px #fff;
    line-height: 60px;
    font-size: 36px;
    color: #fff;
    text-shadow: 0 0 1px #a55208;
  }
</style>

<header>
  <div class="group">
    <div class="group-label">Moves</div>
    <div class="group-value">68</div>
  </div>
  <div class="group target">
    <div class="group-label">Target</div>
    <div class="group-value">
      <LevelTarget />
    </div>
  </div>
  <div class="group score">
    <div class="group-label">Score</div>
    <div class="group-value">{$game.score}</div>
  </div>
</header>
