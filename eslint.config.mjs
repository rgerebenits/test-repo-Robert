import js from "@eslint/js";
import pluginCypress from "eslint-plugin-cypress";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  pluginCypress.configs.recommended,
  prettier,
  {
    ignores: [
      "node_modules/",
      "cypress/reports/",
      "cypress/videos/",
      "cypress/screenshots/",
    ],
  },
];
