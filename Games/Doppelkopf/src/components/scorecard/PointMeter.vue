<template>
  <div id="point-meter">
    <div class="scale">
      <span class="dark"></span>
      <span class="bright"></span>
      <span class="dark"></span>
      <span class="bright"></span>
      <span class="dark"></span>
      <span class="bright"></span>
      <span class="dark"></span>
      <span class="bright"></span>
    </div>
    <div class="bar-wrapper">
      <div class="bar re" :style="reStyle()"></div>
      <div class="bar kontra" :style="kontraStyle()"></div>
    </div>
    <div class="points">
      <span>{{ $tc("points", rePoints) }}</span>
      <span>{{ $tc("points", kontraPoints) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  rePoints: {
    type: Number,
    required: true,
  },
  kontraPoints: {
    type: Number,
    required: true,
  },
});

function reStyle() {
  return `width: ${(props.rePoints / 240) * 100}%`;
}

function kontraStyle() {
  return `width: ${(props.kontraPoints / 240) * 100}%`;
}
</script>

<style scoped>
@import "../../assets/css/vars.css";

#point-meter {
  margin: 16px auto;
  max-width: 620px;
}

.scale {
  position: relative;
  margin-top: -21px;
  top: 21px;
  display: flex;
  height: 21px;
  background: transparent;
}

.scale > span {
  flex-grow: 1;
}

.scale > span.dark {
  background: var(--black);
  opacity: 0.1;
  mix-blend-mode: color-burn;
}

.scale > span.bright {
  background: var(--white);
  opacity: 0.1;
  mix-blend-mode: color-dodge;
}

.bar-wrapper {
  display: flex;
}

.bar {
  margin: 0;
  padding: 8px 0;
}

.kontra {
  background-color: var(--cyan);
  border-bottom: 5px solid var(--cyan-dark);
  border-radius: 0 8px 8px 0;
  color: var(--black);
}

.re {
  background-color: var(--lightblue);
  border-bottom: 5px solid var(--lightblue-dark);
  border-radius: 8px 0 0 8px;
  color: var(--white);
}

.points {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 8px 0;
}

.points > span:first-child {
  padding-left: 8px;
}

.points > span:last-child {
  padding-right: 8px;
}
</style>
