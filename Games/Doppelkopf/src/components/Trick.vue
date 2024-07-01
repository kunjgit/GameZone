<template>
  <div class="trick">
    <div class="cards">
      <transition-group name="card" tag="span">
        <Card
          v-for="playedCard in cards()"
          :key="playedCard.id"
          :card="playedCard.card"
          :player="playedCard.player"
          :position="playedCard.player.tablePosition"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import Card from "./Card.vue";
import { Trick as TrickModel } from "@/models/trick";

const props = defineProps({
  trick: {
    type: Object as PropType<TrickModel>,
    required: true,
  },
});

function cards() {
  return props.trick?.cards();
}
</script>

<style scoped>
.trick {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cards > span {
  display: grid;
  grid-template-areas:
    "top top top"
    "left empty right"
    "bottom bottom bottom";
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.top {
  grid-area: top;
  justify-content: center;
  align-items: end;
  transform: rotate(185deg) translateY(-46px);
}

.left {
  grid-area: left;
  justify-content: end;
  align-items: center;
  transform: rotate(102deg) translateY(-16px);
}

.right {
  grid-area: right;
  justify-content: start;
  align-items: center;
  transform: rotate(-97deg) translateY(-22px);
}

.bottom {
  grid-area: bottom;
  justify-content: center;
  align-items: start;
  transform: rotate(4deg) translateY(-30px);
}

.card-enter-active {
  transition: all 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 0.5s; /* needs to be in sync with the leave transition duration in Hand.vue */
}

.card-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 0s;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
}

@media screen and (max-width: 680px) {
  .top {
    transform: rotate(185deg) translateY(-19px);
  }

  .left {
    transform: rotate(102deg) translateY(-14px);
  }

  .right {
    transform: rotate(-97deg) translateY(-14px);
  }

  .bottom {
    transform: rotate(4deg) translateY(-22px);
  }
}
</style>
