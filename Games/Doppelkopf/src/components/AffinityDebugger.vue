<template>
  <div v-if="config.showAffinityDebugger" class="affinity-debugger">
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Affinitiy</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="playerAffinity in affinities.affinityTable"
          :key="playerAffinity.player.id"
        >
          <td>{{ playerAffinity.player.name }}</td>
          <td>{{ playerAffinity.affinity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { Affinities } from "@/models/affinities";
import { config } from "@/components/config";
import { PropType } from "vue";

defineProps({
  affinities: {
    required: true,
    type: Object as PropType<Affinities>,
  },
});
</script>

<style scoped>
@import "../assets/css/vars.css";
</style>
