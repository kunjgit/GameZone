<script>
  import Game from "./Game.svelte";
</script>

<style>
  main {
    background: url(/assets/bg-blured.png) no-repeat bottom center;
    background-size: cover;
    padding: 40px;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media screen and (max-width: 768px) {
    main {
      padding: 0;
    }
  }
</style>

<main>
  <Game />
</main>
