<template>
  <div
    class="selectable-box"
    :class="{ selected: selected(), disabled }"
    tabindex="0"
    @click="select"
    @keydown.enter="select"
    @keydown.space="select"
  >
    <div class="flex spaced">
      <slot></slot>
    </div>
    <Checkbox :checked="selected()" />
  </div>
</template>

<script setup lang="ts">
import Checkbox from "@/components/reservations/Checkbox.vue";

const props = defineProps({
  disabled: {
    type: Boolean,
  },
  modelValue: {
    required: true,
  },
  selectedValue: {
    required: true,
  }
});

const emit = defineEmits(["update:modelValue"]);
const selected = () => props.modelValue === props.selectedValue;

function select() {
  if (props.disabled) {
    return;
  }

  emit("update:modelValue", props.selectedValue);
}
</script>

<style scoped>
@import "../../assets/css/vars.css";

.selectable-box {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--white-400);
  background-color: var(--white);
  border-radius: 6px;
  cursor: pointer;
}

.selectable-box:hover:not(.disabled) {
  border-color: var(--white-500);
}

.selectable-box:focus {
  outline: 3px solid var(--white-300);
}

.selected {
  border: 1px solid var(--red-dark);
}

.selected:hover {
  border: 1px solid var(--red-dark);
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.flex {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 100%;
}

.spaced {
  margin: 16px;
}
</style>
