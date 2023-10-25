<template>
  <div class="flashMessage">
    <div v-if="icon" class="icon blink">{{ icon }}</div>
    <h1 class="message blink">{{ message }}</h1>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: undefined,
  },
});
</script>

<style scoped>
@import "../assets/css/vars.css";

.flashMessage {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--black);
  z-index: var(--flash-layer);
}

.icon {
  font-size: 5em;
}

.message {
  font-size: 3em;
  font-weight: 900;
}

.blink {
  animation: 2s 0.5s blink;
}

@keyframes blink {
  5% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  15% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  35% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
