<!-- This view is intended for previewing in-development components only. -->

<template>
  <div id="root">
    <reservations :player="game.players[0]" />
  </div>
</template>

<script setup lang="ts">
import { Game } from "@/models/game";
import Reservations from "@/components/reservations/Reservations.vue";

const props = defineProps({
  game: {
    default: () => Game.singlePlayer(),
  },
});
</script>

<style scoped>
#root {
  height: 100%;
}
</style>
