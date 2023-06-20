<template>
  <div v-show="canAnnounce()" class="announcements-button">
    <button
      class="toggle button"
      :class="{ open: isOpen }"
      @click="toggleDropdown"
    >
      <vue-feather type="flag" size="20" />
      <span class="button-text">{{ $t("announce") }}</span>
      <vue-feather type="chevron-up" size="16" />
    </button>
    <div v-show="isOpen" class="dropdown">
      <button
        v-for="a in allAnnouncements()"
        :key="a"
        class="button"
        @click="announce(a)"
      >
        {{ $t(a) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";
import VueFeather from "vue-feather";
import { Player } from "@/models/player";
import { Announcement } from "@/models/announcements";

const isOpen = ref(false);

const props = defineProps({
  player: {
    required: true,
    type: Object as PropType<Player>,
  },
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function closeDropdown() {
  isOpen.value = false;
}

function announce(announcement: Announcement) {
  props.player?.announce(announcement);
  closeDropdown();
}

function canAnnounce() {
  return props.player?.possibleAnnouncements().size > 0;
}

function allAnnouncements() {
  return Array.from(props.player?.possibleAnnouncements()).reverse();
}
</script>

<style scoped>
@import "../assets/css/vars.css";

.announcements-button {
  position: relative;
  z-index: var(--popover-layer);
}

.button-text {
  margin: 0 8px;
}

.open {
  background: var(--red-dark);
  transform: scale(0.95, 0.95);
}

.dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 64px;
  right: 0px;
}

.dropdown button {
  white-space: nowrap;
}

.dropdown button:hover,
.dropdown button:active,
.dropdown button:focus {
  background: var(--red-dark);
}

.dropdown button:hover ~ button,
.dropdown button:active ~ button,
.dropdown button:focus ~ button {
  background: var(--red-dark);
}

.hidden {
  display: none;
}
</style>
