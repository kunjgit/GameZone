<template>
  <div class="toggle" :class="{ disabled }">
    <label>
      {{ label }}
      <input
        :modelValue="modelValue"
        :checked="modelValue"
        type="checkbox"
        :disabled="props.disabled"
        @change="toggle"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  disabled: {
    type: Boolean,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

function toggle() {
  if (props.disabled) {
    return;
  }

  emit("update:modelValue", !props.modelValue);
}
</script>

<style scoped>
@import "../assets/css/app.css";
</style>
