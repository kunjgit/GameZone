<template>
  <div v-if="visible" class="modal" @click.self="emit('clickaway')">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["clickaway"]);
</script>

<style scoped>
@import "../assets/css/vars.css";

.modal {
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  z-index: var(--modal-layer);
  color: var(--black);
  background-color: var(--outline-color);
}

.modal-content {
  max-width: 900px;
  max-height: 100%;
  background-color: var(--white);
  border-radius: 8px;
  box-sizing: border-box;
  padding: 16px;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
