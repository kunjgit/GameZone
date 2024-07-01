<template>
  <div class="all-non-trumps">
    <Card v-for="card in cards" :key="card.cardId" :card="card" />
    <p>All non-trumps</p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import Card from "@/components/Card.vue";
import { ace, king, ten, Suit } from "@/models/card";

const cards = reactive([
  ace.of(Suit.Clubs),
  ten.of(Suit.Clubs),
  king.of(Suit.Clubs),
  ace.of(Suit.Spades),
  ten.of(Suit.Spades),
  king.of(Suit.Spades),
  ace.of(Suit.Hearts),
  king.of(Suit.Hearts),
]);
</script>

<style scoped>
@import "../../assets/css/vars.css";

.all-non-trumps > div {
  margin: 8px;
}

p {
  margin: 8px;
}
</style>
