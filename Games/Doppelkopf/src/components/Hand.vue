<template>
  <div class="hand">
    <div class="cards" :class="position">
      <Card
        v-if="isEmpty()"
        :is-covered="false"
        class="placeholder"
        :position="position"
      />
      <transition-group v-else name="card" tag="span">
        <Card
          v-for="card in hand.cards"
          :key="card.cardId"
          :card="card"
          :is-selected="card.equals(selectedCard)"
          :is-covered="isCovered"
          :is-highlighted="highlight(card)"
          :position="position"
          @click="select(card)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType } from "vue";
import Card from "./Card.vue";
import { Hand as HandModel } from "@/models/hand";
import { Card as CardModel } from "@/models/card";

const props = defineProps({
  hand: {
    type: Object as PropType<HandModel>,
    required: true,
  },
  isCovered: {
    type: Boolean,
    default: false,
  },
  position: String,
  playableCards: {
    type: Object as PropType<Array<CardModel>>,
    required: true,
  },
  isSelectable: Boolean,
});

const selectedCard = ref<CardModel | undefined>();

const emit = defineEmits(["play"]);

function isEmpty() {
  return props.hand.cards.length === 0;
}

function select(card: CardModel) {
  if (!props.isSelectable) return;

  if (card.equals(selectedCard.value)) {
    emit("play", card);
  } else {
    selectedCard.value = card;
  }
}

function highlight(card: CardModel) {
  return props.playableCards.includes(card);
}
</script>

<style scoped>
@import "../assets/css/vars.css";

.cards > span {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.placeholder {
  background-color: var(--white);
  opacity: 0.2;
  border-radius: 8px;
}

.top > span {
  flex-direction: row-reverse;
}

.bottom > span {
  flex-direction: row;
}

.left > span {
  flex-direction: column;
}

.right > span {
  flex-direction: column-reverse;
}

.card-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.top .card-leave-to {
  opacity: 0;
  transform: translateY(120px) rotate(180deg);
}

.bottom .card-leave-to {
  opacity: 0;
  transform: translateY(-120px);
}

.left .card-leave-to {
  opacity: 0;
  transform: translateX(120px) rotate(90deg);
}

.right .card-leave-to {
  opacity: 0;
  transform: translateX(-120px) rotate(-90deg);
}

.top .card,
.bottom .card {
  margin-left: -24px;
}

.bottom .card:hover {
  cursor: pointer;
}

.top .card:last-child,
.bottom .card:first-child {
  margin-left: 0;
}

.left .card,
.right .card {
  margin-top: -64px;
}

.left .card:first-child,
.right .card:last-child {
  margin-top: 0;
}

@media screen and (max-width: 680px) {
  .top .card,
  .bottom .card {
    margin-left: -12px;
  }

  .top .card:last-child,
  .bottom .card:first-child {
    margin-left: 0;
  }

  .left .card,
  .right .card {
    margin-top: -28px;
  }

  .left .card:first-child,
  .right .card:last-child {
    margin-top: 0;
  }
}
</style>
