<template>
  <div class="logo-container">
    <div class="logo">
      <div class="outline right"></div>
      <div class="outline left"></div>
      <div class="card right">
        <div class="suit hearts">
          <svg
            width="83"
            height="83"
            version="1.1"
            viewBox="-1 -1 20 22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m4.5889 6.5938e-7q2.5177 0 3.9563 2.9146 0.5209 1.1534 0.5457 1.7611h0.037207q0.43408-2.0092 1.5751-3.3362 1.3395-1.3395 3.0138-1.3395 2.5921 0 4.1548 2.7781 0.39688 1.0294 0.39688 1.9348 0 3.1006-2.5797 5.9159l-6.5608 7.8755h-0.074414l-6.9701-8.5452q-2.0836-2.5425-2.0836-5.2462 0-2.6169 2.4681-4.1548 1.0418-0.55811 2.1208-0.55811z"
              stroke-width=".26458"
            />
          </svg>
        </div>
      </div>
      <div class="card left">
        <div class="suit clubs">
          <svg
            width="79"
            height="84"
            version="1.1"
            viewBox="-1 -1 19 22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m8.57 6.5938e-7q2.6541 0 3.9067 2.8153 0.16123 0.64492 0.19844 1.3395 0 1.4511-1.4883 3.4354l-0.74414 0.74414h0.03721q0.91777-0.34727 1.9596-0.34727h0.23564q2.9518 0 4.1424 2.5053 0.28525 0.81856 0.28525 1.5627 0 2.5425-2.5921 3.8323-0.49609 0.14883-1.3767 0.22324-3.0014 0-4.254-3.3982h-0.037207v0.11162q0 4.254 1.017 5.6059v0.07441h-2.5797l-0.074414-0.07441q1.0542-1.5875 1.0542-5.7175v-0.03721h-0.037207q-1.2402 3.4354-4.2788 3.4354-2.3688 0-3.6339-2.4929-0.31006-0.84336-0.31006-1.5627 0-2.8897 3.051-3.9191 0.81855-0.14883 1.4511-0.14883h0.11162q1.0666 0 2.034 0.34727h0.037207v-0.037207q-1.0418-0.88057-1.4015-1.7363-0.74414-1.3643-0.74414-2.3688v-0.17363q0-2.4929 2.6665-3.7827 0.88057-0.23564 1.3643-0.23564z"
              stroke-width=".26458"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style scoped>
@import "../assets/css/vars.css";

.logo-container {
  display: flex;
  justify-content: center;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 280px;
  width: 360px;
}

.card {
  z-index: 0;
  background-color: var(--white);
  border-radius: 16px;
}

.outline {
  z-index: -1;
  height: 180px;
  width: 120px;
  border-radius: 16px;
  border: 16px solid var(--white);
}

.suit {
  height: 180px;
  width: 120px;
  border: 8px solid var(--black);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clubs path {
  fill: var(--black);
  stroke: var(--black);
  stroke-linecap: round;
  stroke-width: 2.1;
}

.hearts path {
  fill: var(--red);
  stroke: var(--black);
  stroke-linecap: round;
  stroke-width: 2.1;
}

.logo:hover .left,
.logo:hover .right {
  transform: none;
}

.left {
  transition: transform ease-in 0.2s;
  position: absolute;
  transform: translate(-42px) rotate(-20deg);
}

.right {
  transition: transform ease-in 0.25s;
  position: absolute;
  transform: translate(64px, 0px) rotate(20deg);
}
</style>
