const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: true,
  env: { username: "standard_user", password: "secret_sauce" },
  e2e: {
    baseUrl: "https://www.saucedemo.com/",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewPortHeight: 900,
    viewPortWidth: 1400,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 8000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
