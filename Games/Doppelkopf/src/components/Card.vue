<template>
  <div class="card" :class="[positionClasses()]">
    <div class="card-inner" :class="cardClasses()">
      <template v-if="isCovered || !card">
        <div class="background"></div>
      </template>
      <template v-else>
        <div class="card-top" :class="colorClasses()">
          <div class="rank">{{ $t(card.rank) }}</div>
          <div class="suit">{{ card.suit }}</div>
        </div>
        <span class="card-center" :class="colorClasses()">
          {{ card.suit }}
        </span>
        <div class="card-bottom" :class="colorClasses()">
          <div class="rank">{{ $t(card.rank) }}</div>
          <div class="suit">{{ card.suit }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Suit, Card as CardModel } from "@/models/card";

const props = defineProps({
  card: {
    type: Object as PropType<CardModel>,
    required: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isCovered: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: "unknown",
  },
});

function colorClasses() {
  return {
    red: props.card?.suit === Suit.Hearts || props.card?.suit === Suit.Diamonds,
    black: props.card?.suit === Suit.Clubs || props.card?.suit === Suit.Spades,
  };
}

function positionClasses() {
  return {
    left: props.position === "left",
    right: props.position === "right",
    top: props.position === "top",
    bottom: props.position === "bottom",
  };
}

function cardClasses() {
  return {
    selected: props.isSelected,
    covered: props.isCovered,
  };
}
</script>

<style scoped>
@import "../assets/css/vars.css";

.card {
  display: inline-flex;
}

.card-inner {
  position: relative;
  top: 0px; /* necessary for css transition */
  height: 85px;
  width: 58px;
  color: var(--black);
  background: var(--white-050);
  padding: 6px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.72), 0 0 3px rgba(0, 0, 0, 0.24);
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  transition-property: top, box-shadow;
  user-select: none;
  font-weight: 900;
}

.top {
  transform: rotate(180deg);
}

.left {
  transform: rotate(90deg);
}

.right {
  transform: rotate(-90deg);
}

.selected {
  top: -10px;
  box-shadow: 0 20px 38px rgba(0, 0, 0, 0.25), 0 15px 12px rgba(0, 0, 0, 0.22);
  z-index: var(--card-selected-layer);
}

.card-top {
  position: absolute;
  font-size: 1.1em;
  left: 6px;
  top: 6px;
}

.suit {
  margin-top: -2px;
  font-size: 0.9em;
}

.card-bottom {
  position: absolute;
  font-size: 1.1em;
  right: 6px;
  bottom: 6px;
  transform: rotate(180deg);
}

.card-center {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  height: 100%;
  font-size: 2em;
}

.red {
  color: var(--red);
}

.black {
  color: var(--black);
}

.background {
  background-color: var(--red);
  height: 100%;
  width: 100%;
  display: inline-block;
  border-radius: 6px;
}

@media screen and (max-width: 680px) {
  .background {
    border-radius: 4px;
  }

  .card-inner {
    height: 55px;
    width: 38px;
    border-radius: 4px;
    padding: 3px;
  }

  .selected {
    top: -6px;
  }

  .card-top {
    left: 3px;
    top: 3px;
  }

  .card-bottom {
    right: 3px;
    bottom: 3px;
  }

  .rank {
    font-size: 0.9em;
    font-weight: bold;
  }

  .suit {
    display: none;
  }

  .card-center {
    font-size: 1.5em;
  }

  /* Render all other players' cards on hand a little smaller on small devices */
  /* due to scoping issues, these styles can't be part of Hand.vue */
  .hand .top .card-inner,
  .hand .left .card-inner,
  .hand .right .card-inner {
    height: 38px;
    width: 26px;
  }
}
</style>
