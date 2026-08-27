# Cypress UI & API Test Suite

UI and API test suite built using [Cypress](https://www.cypress.io/).
UI tests run against the [Sauce Demo](https://www.saucedemo.com/) shop, API tests against the [reqres.in](https://reqres.in/) REST API.

## Prerequisites

| Tool          | Version    | Notes                                                                                        |
| ------------- | ---------- | -------------------------------------------------------------------------------------------  |
| Node.js       | `v20.20.1` | as pinned in `.nvmrc`                                                                        |
| nvm           |            |                                                                                              |
| npm           | `10.x`     |                                                                                              |
| Git           | any        |                                                                                              |
| Google Chrome | optional   | only needed for `npm run test:chrome` — the default run uses the bundled Electron browser    |

## Install

```bash
nvm use && npm ci
```

> Use `npm ci` rather than `npm install` (but this can be used too) so the exact versions from `package-lock.json` are used.

Verify the Cypress binary:

```bash
npx cypress verify
```

## Environment variables

`cypress.env.json` is required for the API tests. The file is git-ignored, so create it yourself
by copying the example:

```bash
cp cypress.env.example.json cypress.env.json
```

```json
{ "apiKey": "your-reqres-api-key" }
```

You can get a key on the Reqres website, or use the free one: `reqres-free-v1`.

## Configuration

Set in [`cypress.config.js`](cypress.config.js):

| Option                  | Value                                  | Why it matters                                             |
| ----------------------- | -------------------------------------- | ---------------------------------------------------------- |
| `baseUrl`               | `https://www.saucedemo.com/`           | specs use relative paths, e.g. `cy.visit('/inventory.html')` |
| `viewportWidth/Height`  | 1400 × 900                             |                                                            |
| `retries`               | `2` in run mode, `0` in open mode      |                                                            |
| `defaultCommandTimeout` | `3000` ms                              |                                                            |
| `specPattern`           | `cypress/e2e/**/*.cy.js`               |                                                            |
| `apiUrlGet`             | `https://reqres.in/api/users?page=2`   |                                                            |
| `apiUrlPost`            | `https://reqres.in/api/users`          |                                                            |
| `responseTimeLimit`     | `200` ms                               | max acceptable API response time                            |

## Running the tests

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run cy:open`      | opens the interactive Cypress Test Runner |
| `npm test`             | headless run of the whole suite          |
| `npm run test:chrome`  | headless run in Chrome                   |
| `npm run test:headed`  | headed run that stays open after finishing |

## Expected results

```text
cart.cy.js         5 passing
checkout.cy.js     4 passing, 2 skipped
inventory.cy.js    3 passing, 1 skipped
get-users.cy.js    2 passing
post-users.cy.js   4 passing
```

> The 3 skipped tests are deliberate — each documents a real bug or a missing validation.

## Repository layout

```text
cypress/
  e2e/
    tests/                       UI specs against saucedemo.com
      inventory.cy.js            product list, prices, detail page
      cart.cy.js                 badge counts, cart contents, persistence across sessions
      checkout.cy.js             form validation, totals/tax math, order completion
    api-tests/                   API specs against reqres.in
      get-users.cy.js            GET /users?page=2 — values, counts and types
      post-users.cy.js           POST /users — payload echo, timing, JSON-schema validation
  fixtures/
    users.json                   payloads the POST spec iterates over
  schemas/
    create-user.schema.json      JSON Schema for the POST response
  support/
    commands.js                  custom commands: cy.login(), cy.logout(), cy.prepareCart()
    e2e.js                       loads commands.js
    schema.js                    Ajv-based validateSchema(body, name) helper
cypress.config.js                baseUrl, env, expose, retries, viewport
cypress.env.example.json         template for your local cypress.env.json
```

## Lint & formatting

ESLint and Prettier are configured, with `eslint-config-prettier`:

```bash
npm run lint
```

## Artefacts & reporting

Screenshots, videos and reports are written to `cypress/screenshots/` (git-ignored)
