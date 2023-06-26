<template>
  <modal id="reservations-modal" :visible="true">
    <h1>Alle Gesund?</h1>

    <p>
      Hier sind deine Karten. Willst du ein normales Spiel oder ein Sonderspiel
      spielen?
    </p>

    <div class="hand-wrapper">
      <hand
        :hand="player.hand"
        :position="player.tablePosition"
        :is-selectable="false"
        :is-covered="false"
        :playable-cards="[]"
      />
    </div>

    <div class="dark-box">
      <h2>Spiel mit Partner</h2>
      <div class="flex-row">
        <img
          src="@/assets/img/handshake.png"
          alt="normal game icon"
          class="reservation-icon"
        />
        <p>
          Du möchtest mit einem Partner gegen zwei andere Spieler spielen. Wer
          dein Partner ist, musst du erst noch herausfinden.
        </p>
      </div>

      <div class="flex-container">
        <selectable-box
          id="healthy-option"
          v-model="reservation"
          :selected-value="Reservation.Healthy"
          class="flex-item"
        >
          <img
            src="@/assets/img/healthy.png"
            alt="healthy icon"
            class="reservation-icon"
          />
          <div class="flex-col">
            <h3 class="large-text">Gesund!</h3>
            <p class="regular-text">
              Du möchtest ein <strong>normales Spiel</strong> spielen und
              meldest keinen Vorbehalt an.
            </p>
          </div>
        </selectable-box>

        <selectable-box
          id="wedding-option"
          v-model="reservation"
          :selected-value="Reservation.Wedding"
          class="flex-item"
          disabled
        >
          <img
            src="@/assets/img/rings.png"
            alt="wedding icon"
            class="reservation-icon"
          />
          <div class="flex-col">
            <h3 class="large-text">
              Hochzeit <span class="badge">Coming soon!</span>
            </h3>
            <p class="regular-text">
              Du hast beide Re-Damen. Wer den ersten Stich gewinnt, wird dein
              Partner.
            </p>
          </div>
        </selectable-box>
      </div>

      <div class="flex-container">
        <h2>Solo</h2>
        <div class="flex-row">
          <img
            src="@/assets/img/team.png"
            alt="solo icon"
            class="reservation-icon"
          />
          <p>
            Du spielst allein gegen die drei anderen Spieler. Gewinnst du,
            erhältst du die dreifache Punktzahl.
          </p>
        </div>

        <div class="flex-container">
          <selectable-box
            id="queen-solo-option"
            v-model="reservation"
            :selected-value="Reservation.QueenSolo"
            class="flex-item"
          >
            <div class="flex-col centered-col">
              <img
                src="@/assets/img/queen.png"
                alt="queen icon"
                class="reservation-icon"
              />
              <p class="regular-text bold">Damensolo</p>
              <small> Damen sind Trumpf, alle anderen Karten sind Fehl. </small>
            </div>
          </selectable-box>

          <selectable-box
            id="jack-solo-option"
            v-model="reservation"
            :selected-value="Reservation.JackSolo"
            class="flex-item"
          >
            <div class="flex-col centered-col">
              <img
                src="@/assets/img/jack.png"
                alt="jack icon"
                class="reservation-icon"
              />
              <p class="regular-text bold">Bubensolo</p>
              <small> Buben sind Trumpf, alle anderen Karten sind Fehl. </small>
            </div>
          </selectable-box>

          <suit-selector-box
            id="suit-solo-option"
            v-model="reservation"
            :selected="isSuitSoloSelected()"
            class="flex-item"
          />

          <selectable-box
            id="ace-solo-option"
            v-model="reservation"
            :selected-value="Reservation.AceSolo"
            class="flex-item"
          >
            <div class="flex-col centered-col">
              <img
                src="@/assets/img/skeleton.png"
                alt="skeleton icon"
                class="reservation-icon"
              />
              <p class="regular-text bold">Fleischloser</p>
              <small>
                Es gibt keine Trümpfe, alle Karten sind Fehl und werden
                eingereiht
              </small>
            </div>
          </selectable-box>
        </div>
      </div>
    </div>

    <div>
      <button
        id="reservation-button"
        type="button"
        class="button"
        @click="reservationButtonClicked"
      >
        {{ buttonText() }}
      </button>
    </div>
  </modal>
</template>

<script setup lang="ts">
import { Player } from "@/models/player";
import Modal from "@/components/Modal.vue";
import Hand from "@/components/Hand.vue";
import { PropType, ref } from "vue";
import SelectableBox from "@/components/reservations/SelectableBox.vue";
import SuitSelectorBox from "@/components/reservations/SuitSelectorBox.vue";
import { Reservation } from "@/models/reservations";

defineProps({
  player: {
    type: Object as PropType<Player>,
    required: true,
  },
});

const reservation = ref<Reservation>(Reservation.Healthy);
const emit = defineEmits(["reservation-selected"]);

function buttonText() {
  return reservation.value === Reservation.Healthy
    ? "Normales Spiel spielen"
    : "Vorbehalt anmelden";
}

function isSuitSoloSelected() {
  return [
    Reservation.ClubsSolo,
    Reservation.SpadesSolo,
    Reservation.HeartsSolo,
    Reservation.DiamondsSolo,
  ].includes(reservation.value);
}

function reservationButtonClicked() {
  emit("reservation-selected", reservation.value);
}
</script>

<style scoped>
@import "../../assets/css/vars.css";

p {
  color: var(--black);
}

h2 {
  margin-bottom: 4px;
}
.dark-box {
  background: var(--white-100);
  padding: 16px;
  border: 1px solid var(--white-300);
  border-top: none;
  border-radius: 0 0 6px 6px;
  margin-bottom: 24px;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.flex-item {
  flex: 1 0 0;
  flex-basis: 0;
  flex-shrink: 1;
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}

.flex-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.centered-col {
  align-items: center;
  text-align: center;
}

.large-text {
  font-size: 1.4em;
  margin: 0;
}

.bold {
  font-weight: bold;
}

.regular-text {
  margin: 0;
}

.badge {
  font-family: sans-serif;
  font-weight: regular;
  font-style: normal;
  display: inline-block;
  color: var(--white);
  background: var(--lightblue);
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 6px;
  margin-bottom: 4px;
  vertical-align: middle;
}

.hand-wrapper {
  border-radius: 8px 8px 0 0;
  background: var(--black);
  padding: 24px;
  border: 1px solid var(--black);
  border-bottom: none;
}

.reservation-icon {
  max-width: 64px;
  max-height: 64px;
}
</style>
