const { defineConfig } = require('cypress');

module.exports = defineConfig({
  expose: {
    apiUrlGet: 'https://reqres.in/api/users?page=2',
    apiUrlPost: 'https://reqres.in/api/users',
    responseTimeLimit: 200,
  },
  env: {
    // written here as these are not secrets but rather
    // login details provided by the web app on landing page
    username: 'standard_user',
    password: 'secret_sauce',
  },
  e2e: {
    baseUrl: 'https://www.saucedemo.com/',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportHeight: 900,
    viewportWidth: 1400,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 3000,
  },
  allowCypressEnv: false,
});
