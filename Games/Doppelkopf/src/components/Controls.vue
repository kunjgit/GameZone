<template>
  <div class="controls">
    <button
      v-if="showNextTrickButton()"
      class="button next"
      @click="$emit('nextTrick')"
    >
      {{ $t("next-trick") }}
    </button>
    <button
      v-if="showFinishRoundButton()"
      class="button finish"
      @click="$emit('finishRound')"
    >
      {{ $t("finish-round") }}
    </button>

    <AnnouncementsButton v-if="enableAnnouncements" :player="game.players[0]" />
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";
import AnnouncementsButton from "@/components/AnnouncementsButton.vue";
import { Features } from "@/models/features";
import { Game } from "@/models/game";

const props = defineProps({
  game: {
    type: Object as PropType<Game>,
    required: true,
  },
});

defineEmits(["nextTrick", "finishRound"]);

function showNextTrickButton() {
  return (
    props.game.currentTrick.isFinished() &&
    !props.game.currentRound.noMoreCardsLeft()
  );
}

function showFinishRoundButton() {
  return (
    props.game.currentRound.noMoreCardsLeft() &&
    !props.game.currentRound.isFinished()
  );
}

const enableAnnouncements = ref(false);
enableAnnouncements.value = Features.enableAnnouncements;
</script>

<style scoped>
@import "../assets/css/app.css";

.controls {
  grid-area: controls;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
