<template>
  <div class="notification-container">
    <div class="notifications">
      <transition-group name="message">
        <div
          v-for="sticky in stickies"
          :key="sticky.id"
          class="msg clickable sticky"
          @click="sticky.onClick"
        >
          {{ $t(sticky.text, sticky.args) }}
          <button class="close-button" @click.stop.prevent="sticky.onDismiss">
            <vue-feather type="x" size="20" />
          </button>
        </div>
      </transition-group>
      <transition-group name="message">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="msg"
        >
          {{ $t(notification.text, notification.args) }}
        </div>
      </transition-group>
    </div>
    <div class="flashMessages">
      <FlashMessage v-if="flashMessages[0]" :message="flashMessages[0].text" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { notifier } from "@/models/notifier";
import FlashMessage from "@/components/FlashMessage.vue";
import VueFeather from "vue-feather";

const { stickies, notifications, flashMessages } = notifier;
</script>

<style scoped>
@import "../assets/css/vars.css";

.notifications {
  width: 100%;
  position: absolute;
  top: 2px;
  z-index: var(--notification-layer);
  display: flex;
  flex-direction: column;
}

.msg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px auto 6px;
  padding: 8px;
  width: 50%;
  font-size: 1em;
  background: var(--lightblue);
  color: var(--white);
  border-radius: 6px;
  box-shadow: 0 12px 18px rgba(0, 0, 0, 0.12);
}

.message-enter-active,
.message-leave-active {
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(-48px);
}

.close-button {
  background: none;
  border: none;
  color: var(--white);
  margin: 0;
  margin-left: 12px;
  padding: 0;
  cursor: pointer;
}

.clickable {
  cursor: pointer;
}

@media screen and (max-width: 680px) {
  .message {
    width: 90%;
  }
}
</style>
