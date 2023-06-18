<template>
  <div id="languages">
    <span v-for="(lang, i) in availableLanguages" :key="i" class="language">
      <input :id="lang" v-model="$i18n.locale" type="radio" :value="lang" />
      <label :for="lang">{{ $t(lang) }}</label>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const availableLanguages = ref(["en", "de"]);
</script>

<style scoped>
@import "../assets/css/app.css";

#languages {
  margin: 6px;
  display: flex;
}

label {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

input[type="radio"]:checked + label {
  background-color: var(--lightblue);
  color: var(--white);
}

input {
  display: none;
}
</style>
