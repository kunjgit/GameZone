<template>
  <div class="player">
    <div class="info">
      <div class="name-info">
        <div class="name title-font">
          {{ player.name }}
          <vue-feather
            v-if="isWinner()"
            type="award"
            class="winner"
            :title="$t('badge_description', { name: player.name })"
            size="18"
          />
        </div>
      </div>
      <div class="stats">
        <div v-if="player.isHuman" class="party">
          <vue-feather type="users" size="14" />
          {{ player.hand.isRe() ? "Re" : "Kontra" }}
        </div>
        <div class="announcements">
          <div
            v-if="player.announcements.size > 0"
            class="announcement flag-icon"
          >
            <vue-feather type="flag" size="14" />
          </div>
          <div
            v-for="announcement in player.announcements"
            :key="announcement"
            class="announcement"
          >
            {{ $t(`${announcement}_short`) }}
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <Hand
        :hand="player.hand"
        :is-covered="isCovered"
        :is-selectable="isHandSelectable"
        :position="player.tablePosition"
        :playable-cards="playable()"
        @play="play"
      />
      <TrickStack :trick-stack="player.trickStack" />
    </div>
    <div class="trickCountSmall">
      {{ $tc("trick", player.trickStack.tricks.length) }}
    </div>
    <AffinityDebugger :affinities="player.behavior.affinities" />
  </div>
</template>

<script setup lang="ts">
import Hand from "./Hand.vue";
import TrickStack from "./TrickStack.vue";
import VueFeather from "vue-feather";
import { Player as PlayerModel } from "@/models/player";
import { playableCards } from "@/models/playableCardFinder";
import { Card } from "@/models/card";
import { PropType } from "vue";
import AffinityDebugger from "./AffinityDebugger.vue";

const props = defineProps({
  player: {
    type: Object as PropType<PlayerModel>,
    required: true,
  },
});

const isCovered = !props.player.isHuman;
const isHandSelectable = props.player.isHuman;

function isWinner() {
  return (
    props.player.game?.currentTrick.winner() == props.player &&
    props.player.game?.currentTrick.isFinished()
  );
}

async function play(card: Card) {
  await props.player.play(card);
}

function playable() {
  return playableCards(
    props.player.hand.cards,
    props.player.game?.currentTrick.baseCard()
  );
}
</script>

<style scoped>
@import "../assets/css/vars.css";
.player {
  display: flex;
  flex-direction: column;
  margin: auto;
}

.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.left .container,
.right .container {
  flex-direction: column;
  align-items: center;
}

.info {
  margin: 6px;
}

.bottom .info {
  flex-direction: column;
}

.name-info {
  padding: 6px;
}

.name-info,
.stats {
  display: flex;
  justify-content: center;
  align-items: center;
}

.left .name-info,
.right .name-info {
  flex-direction: column;
}

.name {
  white-space: nowrap;
  font-size: 1.4em;
}

.title-font {
  margin-right: 4px;
}

.party {
  background: var(--lightblue);
  color: var(--white);
  border-radius: 6px;
  border: 2px solid var(--black);
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
}

.announcements {
  margin-left: 12px;
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.left .announcements,
.right .announcements {
  margin-left: 0;
  flex-wrap: wrap;
}

.announcement {
  background: var(--red);
  color: var(--white);
  border-radius: 6px;
  border: 2px solid var(--black);
  padding: 4px 12px 4px 6px;
  margin-right: -8px;
  display: inline-flex;
  align-items: center;
}

.flag-icon {
  padding: 6px 12px 6px 4px;
}

.announcement:last-child {
  padding-right: 6px;
  margin-right: 0;
}

.party svg {
  margin-right: 4px;
}

.bottom .hand,
.top .hand {
  margin-right: 12px;
}

.trickCountSmall {
  margin-top: 6px;
  text-align: right;
  display: none;
}

.left .trickCountSmall,
.right .trickCountSmall {
  text-align: center;
}

@media screen and (max-width: 680px) {
  .name {
    font-size: 1.1em;
  }

  .party,
  .announcement {
    font-size: 0.8em;
  }

  .flag-icon {
    padding: 4px 10px 5px 4px;
  }

  .bottom .hand,
  .top .hand {
    margin-right: 0;
  }

  .trickCountSmall {
    display: block;

    font-size: 0.8em;
  }
}
</style>
