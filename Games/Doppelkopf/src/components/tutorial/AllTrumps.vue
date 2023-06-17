<template>
  <div class="all-trumps">
    <Card v-for="card in trumps" :key="card.cardId" :card="card" />
    <p>All trumps ordered from highest to lowest</p>
  </div>
</template>

<script setup lang="ts">
import Card from "@/components/Card.vue";
import { trumps } from "@/models/card";
</script>

<style scoped>
@import "../../assets/css/vars.css";

.all-trumps > div {
  margin: 8px;
}

p {
  margin: 8px;
}
</style>
