<template>
  <div class="options">
    <div
      v-if="trick"
      class="icon icon-rewind"
      :title="$t('show_last_trick_header')"
      @click="toggleVisibility()"
    >
      <vue-feather type="rotate-ccw" />
    </div>
    <modal v-if="trick" :visible="visible" @clickaway="hideMenu()">
      <h2>{{ $t("show_last_trick_header") }}</h2>
      <div class="option">
        <span class="label">
          {{ $t("show_last_trick_label", { name: trick.winner()?.name }) }}
        </span>
      </div>
      <div class="background-wrapper">
        <Trick :trick="trick" />
      </div>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { Trick as TrickModel } from "@/models/trick";
import Trick from "@/components/Trick.vue";
import Modal from "@/components/Modal.vue";
import VueFeather from "vue-feather";

defineProps({
  trick: {
    type: Object as PropType<TrickModel>,
    required: false,
    default: undefined,
  },
});

const visible = ref(false);

function toggleVisibility() {
  visible.value = !visible.value;
}

function hideMenu() {
  visible.value = false;
}
</script>

<style scoped>
@import "../assets/css/vars.css";

.icon {
  position: absolute;
  border-radius: 4px;
  background-color: var(--white);
  padding: 8px;
  color: var(--black);
  cursor: pointer;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
  z-index: var(--menu-icon-layer);
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-rewind {
  top: 60px;
  right: 12px;
}

.option {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
}

.label {
  font-weight: bold;
  margin-right: 18px;
}

h2 {
  margin-top: 0;
}

.background-wrapper {
  background: var(--black);
  border-radius: 8px;
}
</style>
