<template>
  <div class="quiz-trump-non-trump">
    <h2>Trumpf oder Fehl?</h2>
    <transition name="card">
      <Card v-if="showCard" :card="cards[currentCard]" />
    </transition>
    <div class="text">
      <div class="question">Diese Karte ist&hellip;</div>
      <button class="button trump" @click="checkAnswer(true)">Trumpf</button>
      <button class="button non-trump" @click="checkAnswer(false)">Fehl</button>
    </div>

    <transition name="message">
      <div v-if="lastMessage" class="result">
        {{ lastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import Card from "@/components/Card.vue";
import { ace, jack, queen, king, ten, Suit } from "@/models/card";

const cards = [
  ace.of(Suit.Clubs),
  ace.of(Suit.Diamonds),
  jack.of(Suit.Spades),
  jack.of(Suit.Hearts),
  ten.of(Suit.Clubs),
  king.of(Suit.Hearts),
  ace.of(Suit.Spades),
  queen.of(Suit.Spades),
  king.of(Suit.Diamonds),
  ten.of(Suit.Hearts),
];
const currentCard = ref(0);
const lastMessage = ref("");
const showCard = ref(true);

function checkAnswer(answeredTrump: boolean) {
  let card = cards[currentCard.value];
  if (card.isTrump() == answeredTrump) {
    // hack: need to hide and show on next tick to make transition work
    showCard.value = false;
    showMessage("🎉 Correct!");

    nextCard();
    nextTick(() => {
      showCard.value = true;
    });
  } else {
    let message = "❌ Nah, that's not right.";
    message += ` ${card.whyTrump()}`;
    showMessage(message);
  }
}

function showMessage(message: string) {
  lastMessage.value = message;

  setTimeout(() => {
    lastMessage.value = "";
  }, 4000);
}

function nextCard() {
  currentCard.value = (currentCard.value + 1) % cards.length;
}
</script>

<style scoped>
@import "../../assets/css/vars.css";
@import "../../assets/css/button.css";

.quiz-trump-non-trump {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-enter-active {
  transition: all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-enter-from {
  opacity: 0;
  transform: scale(2, 2);
}

.message-enter-active,
.message-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.message-leave-to {
  opacity: 0;
}

.message-enter-from {
  opacity: 0;
  transform: scale(0.5, 0.5);
}

.text {
  margin-top: 32px;
}

.result {
  margin-top: 16px;
}

div {
  margin: 8px;
}
</style>
