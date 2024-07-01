<template>
  <Transition>
    <div v-if="checked" class="checkmark">
      <vue-feather type="check" size="16" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import VueFeather from "vue-feather";

defineProps({
  checked: {
    type: Boolean,
  },
});
</script>

<style scoped>
.checkmark {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: var(--red-dark);
  border-radius: 50%;
  color: var(--white);
  border: 2px solid var(--white);
  padding: 6px;
}

.checkmark i {
  display: block;
  height: 100%;
  width: 100%;
}

.v-enter-active,
.v-leave-active {
  transition: transform 0.1s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: scale(0);
}
</style>
