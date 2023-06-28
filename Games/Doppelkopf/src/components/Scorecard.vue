<template>
  <div class="scorecard">
    <div class="scroll-container">
      <h1 class="message">{{ $t(message()) }}</h1>

      <div class="parties">
        <div class="party-wrapper">
          <div
            v-if="currentScore.winningPartyName() === PartyName.Re"
            class="winner-balloon"
          >
            🎈 {{ $t("winner") }}
          </div>
          <div class="party-bubble">
            <div class="party re">Re</div>
            <div class="names">
              {{ partyMembers("Re") }}
            </div>
          </div>
        </div>

        <div class="party-wrapper">
          <div
            v-if="currentScore.winningPartyName() === PartyName.Kontra"
            class="winner-balloon"
          >
            🎈 {{ $t("winner") }}
          </div>
          <div class="party-bubble">
            <div class="party kontra">Kontra</div>
            <div class="names">
              {{ partyMembers("Kontra") }}
            </div>
          </div>
        </div>
      </div>

      <div class="meter">
        <PointMeter
          :re-points="currentScore.trickPoints(PartyName.Re)"
          :kontra-points="currentScore.trickPoints(PartyName.Kontra)"
        />
      </div>

      <div class="row">
        <div class="column">
          <h2>{{ $t("score") }}</h2>

          <div class="row">
            <table>
              <colgroup>
                <col class="pointsCol" />
                <col class="extrasCol" />
                <col class="pointsCol" />
                <col class="extrasCol" />
              </colgroup>
              <tr>
                <th colspan="2">
                  <div class="summary">
                    <strong>Re</strong>
                  </div>
                </th>

                <th colspan="2">
                  <div class="summary">
                    <strong>Kontra</strong>
                  </div>
                </th>
              </tr>
              <tr v-for="i in extrasLength()" :key="i" class="extras">
                <td v-if="reExtra(i)">{{ reExtra(i).points }}</td>
                <td v-if="reExtra(i)" class="re">
                  {{ $t(reExtra(i).i18nKey) }}
                </td>
                <td v-if="kontraExtra(i)">{{ kontraExtra(i).points }}</td>
                <td v-if="kontraExtra(i)" class="kontra">
                  {{ $t(kontraExtra(i).i18nKey) }}
                </td>
              </tr>
              <tr>
                <td colspan="2" class="sum re">
                  <span v-if="currentScore.winningPartyName() === PartyName.Re">
                    {{ $tc("points", currentScore.totalPoints(PartyName.Re)) }}
                  </span>
                </td>
                <td colspan="2" class="sum kontra">
                  <span
                    v-if="currentScore.winningPartyName() === PartyName.Kontra"
                  >
                    {{
                      $tc("points", currentScore.totalPoints(PartyName.Kontra))
                    }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="column">
          <h2>{{ $t("scorecard") }}</h2>
          <table>
            <tr>
              <th
                v-for="player in players"
                :key="player.id"
                class="player right-aligned"
              >
                {{ player.name }}
              </th>
              <th class="right-aligned">{{ $t("points-plain") }}</th>
            </tr>
            <tr
              v-for="(scoreLine, index) in scorecard.scoreLines"
              :key="scoreLine.id"
              class="scoreLine"
              :class="{ bold: isLastLine(index) }"
            >
              <td
                v-for="player in players"
                :key="player.id"
                class="right-aligned"
              >
                {{ scoreLine.totalPoints[player.id] }}
              </td>
              <td class="right-aligned">
                {{ scoreLine.points }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div class="button-row">
      <button class="button next-round" @click="triggerNextRound">
        {{ $t("next-round") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PointMeter from "./scorecard/PointMeter.vue";
import { Scorecard as ScorecardModel } from "@/models/scorecard";
import { Player } from "@/models/player";
import { Score } from "@/models/score";
import { PartyName } from "@/models/party";
import { PropType } from "vue";

const props = defineProps({
  scorecard: {
    type: Object as PropType<ScorecardModel>,
    required: true,
  },
  players: {
    type: Object as PropType<Player[]>,
    required: true,
  },
  currentScore: {
    type: Object as PropType<Score>,
    required: true,
  },
});

const emit = defineEmits(["nextRound"]);

const reExtras = props.currentScore.listExtras(PartyName.Re);
const kontraExtras = props.currentScore.listExtras(PartyName.Kontra);

function message() {
  return props.currentScore
    .winner()
    ?.players.map((p) => p.id)
    .includes(props.players[0].id)
    ? "you_win"
    : "you_lose";
}

function extrasLength() {
  return Math.max(reExtras.length, kontraExtras.length);
}

function triggerNextRound() {
  emit("nextRound");
}

function isLastLine(index: number) {
  return index === props.scorecard.scoreLines.length - 1;
}

function reExtra(index: number) {
  return reExtras[Math.max(index - 1)] || undefined;
}

function kontraExtra(index: number) {
  return kontraExtras[Math.max(0, index - 1)] || undefined;
}

function partyMembers(party: string) {
  return props.currentScore.parties[party].playerNames();
}
</script>

<style scoped>
@import "../assets/css/vars.css";

.scorecard {
  box-sizing: border-box;
  font-family: sans-serif;
  text-align: left;
  background: white;
  margin: 6px;
  border-radius: 6px;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 24px;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  margin-left: auto;
  margin-right: auto;
  max-width: 900px;
  width: 75%;
  max-height: 90%;
  color: var(--black);
  display: flex;
  flex-direction: column;
  z-index: var(--modal-layer);
}

.scroll-container {
  overflow-y: auto;
  flex-grow: 10;
  padding: 12px;
}

h1,
h2,
h3 {
  text-align: center;
  margin-bottom: 32px;
}

.scorecard table {
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.pointsCol {
  width: 32px;
}

td {
  padding: 6px 0;
  vertical-align: top;
}

th,
td {
  line-height: 1.4em;
}

.summary {
  display: inline-block;
}

.player {
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-aligned {
  text-align: right;
}

.bold {
  font-weight: bold;
}

.button-row {
  padding: 12px;
  text-align: right;
  flex-grow: 1;
}

.extras {
  line-height: 1.5em;
}

.extras svg {
  vertical-align: text-bottom;
  color: var(--black);
  opacity: 0.3;
  padding-right: 4px;
}

.extras svg:hover {
  opacity: 1;
}

.sum {
  padding: 6px 0;
  text-align: left;
  width: 100%;
}

.parties {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 12px;
}

.party-wrapper {
  display: inline-flex;
  flex-direction: column;
}

.winner-balloon {
  padding: 4px 12px;
  font-weight: bold;
}

.party-bubble {
  display: inline-flex;
  align-items: center;
  margin: 8px;
}

.party {
  padding: 6px 18px;
  border-radius: 18px;
  z-index: var(--base-layer);
  font-weight: bold;
}

.names {
  padding: 6px 12px 6px 32px;
  background-color: var(--white-200);
  border-radius: 18px;
  margin-left: -24px;
  z-index: 0;
}

.party.re {
  background-color: var(--lightblue);
  color: var(--white);
}

.party.kontra {
  background-color: var(--cyan);
}

.meter {
  padding: 12px 0;
}

@media screen and (max-width: 960px) {
  .scorecard {
    top: 4px;
    min-width: 98%;
    min-height: 98%;
  }

  .party-bubble {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 4px;
  }

  .party {
    margin: 0;
    border-radius: 8px 8px 0 0;
  }

  .names {
    padding: 8px 12px;
    border-radius: 12px;
    margin: 0;
    border-radius: 0 0 8px 8px;
  }

  th {
    font-size: 0.9em;
  }

  .button-row {
    box-shadow: -1px 0 8px 3px rgba(0, 0, 0, 0.08);
  }
}
</style>
