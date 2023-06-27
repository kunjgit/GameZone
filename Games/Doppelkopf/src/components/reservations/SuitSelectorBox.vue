<template>
  <div class="outer-box flex-col">
    <div
      class="selectable-box"
      :class="{ selected, disabled }"
      tabindex="0"
      @click="selectNext"
      @keydown.enter="selectNext"
      @keydown.space="selectNext"
      @keydown.arrow-right="selectNext"
      @keydown.arrow-left="selectPrevious"
    >
      <div class="flex-col spaced">
        <img
          :src="currentImagePath()"
          :alt="$t(current().suitSoloTitleI18nKey)"
          class="reservation-icon"
        />
        <p class="bold">{{ $t(current().suitSoloTitleI18nKey) }}</p>
        <small>{{ $t(current().suitSoloTextI18nKey) }}</small>
      </div>
      <Checkbox :checked="selected" />
    </div>
    <div class="suits">
      <div
        class="suit-box black"
        :class="{ active: selectedValue === Reservation.ClubsSolo }"
        @click="selectSuit(Reservation.ClubsSolo)"
      >
        {{ Suit.Clubs }}
      </div>
      <div
        class="suit-box black"
        :class="{ active: selectedValue === Reservation.SpadesSolo }"
        @click="selectSuit(Reservation.SpadesSolo)"
      >
        {{ Suit.Spades }}
      </div>
      <div
        class="suit-box red"
        :class="{ active: selectedValue === Reservation.HeartsSolo }"
        @click="selectSuit(Reservation.HeartsSolo)"
      >
        {{ Suit.Hearts }}
      </div>
      <div
        class="suit-box red"
        :class="{ active: selectedValue === Reservation.DiamondsSolo }"
        @click="selectSuit(Reservation.DiamondsSolo)"
      >
        {{ Suit.Diamonds }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Suit } from "@/models/card";
import { Reservation } from "@/models/reservations";
import Checkbox from "@/components/reservations/Checkbox.vue";

const props = defineProps({
  disabled: {
    type: Boolean,
  },
  modelValue: {
    required: true,
  },
  selected: {
    type: Boolean,
  },
});
const emit = defineEmits(["update:modelValue"]);

type SuitSolo =
  | Reservation.ClubsSolo
  | Reservation.SpadesSolo
  | Reservation.HeartsSolo
  | Reservation.DiamondsSolo;

interface SoloConfiguration {
  imagePath: string;
  nextSoloType: SuitSolo;
  previousSoloType: SuitSolo;
  suitName: Suit;
  suitSoloTitleI18nKey: string;
  suitSoloTextI18nKey: string;
}

const soloConfig: { [key in SuitSolo]: SoloConfiguration } = {
  [Reservation.ClubsSolo]: {
    imagePath: "clubs.png",
    nextSoloType: Reservation.SpadesSolo,
    previousSoloType: Reservation.DiamondsSolo,
    suitName: Suit.Clubs,
    suitSoloTitleI18nKey: "suit-solo-clubs-title",
    suitSoloTextI18nKey: "suit-solo-clubs-text",
  },
  [Reservation.SpadesSolo]: {
    imagePath: "spades.png",
    nextSoloType: Reservation.HeartsSolo,
    previousSoloType: Reservation.ClubsSolo,
    suitName: Suit.Spades,
    suitSoloTitleI18nKey: "suit-solo-spades-title",
    suitSoloTextI18nKey: "suit-solo-spades-text",
  },
  [Reservation.HeartsSolo]: {
    imagePath: "heart.png",
    nextSoloType: Reservation.DiamondsSolo,
    previousSoloType: Reservation.SpadesSolo,
    suitName: Suit.Hearts,
    suitSoloTitleI18nKey: "suit-solo-hearts-title",
    suitSoloTextI18nKey: "suit-solo-hearts-text",
  },
  [Reservation.DiamondsSolo]: {
    imagePath: "diamonds.png",
    nextSoloType: Reservation.ClubsSolo,
    previousSoloType: Reservation.HeartsSolo,
    suitName: Suit.Diamonds,
    suitSoloTitleI18nKey: "suit-solo-diamonds-title",
    suitSoloTextI18nKey: "suit-solo-diamonds-text",
  },
};

const selectedValue = ref<SuitSolo>(Reservation.ClubsSolo);

function current() {
  return soloConfig[selectedValue.value];
}

function currentImagePath() {
  const img = current().imagePath;
  return `src/assets/img/${img}`;
}

function selectNext() {
  selectSuit(props.selected ? current().nextSoloType : selectedValue.value);
}

function selectPrevious() {
  selectSuit(props.selected ? current().previousSoloType : selectedValue.value);
}

function selectSuit(suit: SuitSolo) {
  if (props.disabled) {
    return;
  }

  selectedValue.value = suit;
  emit("update:modelValue", selectedValue.value);
}
</script>

<style scoped>
@import "../../assets/css/vars.css";

p {
  color: var(--black);
  margin: 0;
  text-align: center;
}

.outer-box {
  cursor: pointer;
}

.selectable-box {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--white-400);
  background-color: var(--white);
  border-radius: 6px 6px 0 0;
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

.disabled {
  opacity: 0.5;
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

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.bold {
  font-weight: bold;
}

.reservation-icon {
  max-width: 64px;
  max-height: 64px;
}

.suits {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-radius: 0 0 8px 8px;
}

.selectable-box:focus ~ .suits {
  outline: 3px solid var(--white-300);
}

.suit-box {
  padding: 8px 6px;
  margin-top: -2px;
  background-color: var(--white-050);
  border: 1px solid var(--white-400);
  width: 100%;
  text-align: center;
  border-radius: 0 0 8px 8px;
  z-index: 1;
}

.suit-box.active {
  background-color: var(--white);
  border-top: none;
}

.suit-box:not(.active) {
  background: linear-gradient(
    180deg,
    var(--white-300) 0%,
    var(--white-050) 15%,
    var(--white-050) 100%
  );
}

.selected ~ .suits .suit-box {
  border-top-color: var(--red-dark);
}

.suit-box:last-of-type {
  border-right: 1px solid var(--white-400);
}

.suit-box.red {
  color: var(--red);
}

.suit-box.black {
  color: var(--black);
}

.suit-box:not(.active):hover {
  border-color: var(--white-500);
  background-color: var(--white-100);
}

.selectable-box:hover ~ .suits .suit-box {
  border-color: var(--white-500);
}

.selectable-box.selected ~ .suits .suit-box.active {
  border-color: var(--red-dark);
}

.selectable-box.selected:hover ~ .suits .suit-box.active {
  border-color: var(--white-500);
}
</style>
