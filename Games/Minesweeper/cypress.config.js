const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl:
      process.env.CYPRESS_BASE_URL ||
      "http://127.0.0.1:5500/Games/Minesweeper",

    setupNodeEvents(on, config) {
      return config;
    },
  },
});