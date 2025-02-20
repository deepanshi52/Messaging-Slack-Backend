import globals from "globals";
import pluginJs from "@eslint/js";
import simpleImportSort from 'eslint-plugin-simple-import-sort';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { 
      globals: globals.node 
    },
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    },
  },
  pluginJs.configs.recommended,
];